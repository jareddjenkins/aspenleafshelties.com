const admin = require('firebase-admin');
const logger = require('firebase-functions/logger');
const { onDocumentCreated } = require('firebase-functions/v2/firestore');
const { defineSecret } = require('firebase-functions/params');
const nodemailer = require('nodemailer');

admin.initializeApp();

const inquiryEmailConfig = defineSecret('INQUIRY_EMAIL_CONFIG');

exports.sendInquiryNotification = onDocumentCreated(
  {
    document: 'inquiries/{inquiryId}',
    region: 'us-central1',
    secrets: [inquiryEmailConfig],
  },
  async (event) => {
    const snapshot = event.data;
    if (!snapshot) {
      logger.warn('Missing Firestore snapshot for inquiry trigger.');
      return;
    }

    const inquiryId = event.params.inquiryId;
    const inquiry = snapshot.data();
    const config = getEmailConfig();
    const transporter = createTransporter(config);

    try {
      await transporter.sendMail({
        from: config.from,
        to: config.to,
        replyTo: inquiry.email,
        subject: buildSubject(inquiry),
        text: buildTextBody(inquiryId, inquiry),
        html: buildHtmlBody(inquiryId, inquiry),
      });

      await snapshot.ref.set(
        {
          notification: {
            status: 'sent',
            sentAt: admin.firestore.FieldValue.serverTimestamp(),
            recipient: config.to,
          },
        },
        { merge: true },
      );

      logger.info('Inquiry notification sent.', { inquiryId });
    } catch (error) {
      logger.error('Failed to send inquiry notification.', { inquiryId, error });

      await snapshot.ref.set(
        {
          notification: {
            status: 'failed',
            attemptedAt: admin.firestore.FieldValue.serverTimestamp(),
            recipient: config.to,
            errorMessage: toErrorMessage(error),
          },
        },
        { merge: true },
      );

      throw error;
    }
  },
);

function getEmailConfig() {
  const rawValue = inquiryEmailConfig.value();
  let parsed;

  try {
    parsed = JSON.parse(rawValue);
  } catch (error) {
    throw new Error('INQUIRY_EMAIL_CONFIG must be valid JSON.');
  }

  const requiredFields = ['host', 'port', 'user', 'pass', 'from', 'to'];
  for (const field of requiredFields) {
    if (!parsed[field]) {
      throw new Error(`INQUIRY_EMAIL_CONFIG is missing required field "${field}".`);
    }
  }

  return {
    host: parsed.host,
    port: Number(parsed.port),
    secure: Boolean(parsed.secure),
    user: parsed.user,
    pass: parsed.pass,
    from: parsed.from,
    to: parsed.to,
  };
}

function createTransporter(config) {
  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.user,
      pass: config.pass,
    },
  });
}

function buildSubject(inquiry) {
  const sourceLabel = inquiry.source === 'questionnaire-page' ? 'Questionnaire' : 'Inquiry';
  return `New Aspenleaf ${sourceLabel}: ${inquiry.fullName || 'Unknown'}${inquiry.location ? ` - ${inquiry.location}` : ''}`;
}

function buildTextBody(inquiryId, inquiry) {
  const basics = buildBasicsLines(inquiry);
  const lines = [
    'New Aspenleaf inquiry received',
    '',
    `${EMAIL_LABELS.name}: ${inquiry.fullName || ''}`,
    `${EMAIL_LABELS.email}: ${inquiry.email || ''}`,
    `${EMAIL_LABELS.phone}: ${inquiry.phone || ''}`,
    `${EMAIL_LABELS.location}: ${inquiry.location || ''}`,
    '',
    'Basics',
    ...basics,
  ];

  lines.push('', `Inquiry ID: ${inquiryId}`);

  return lines.filter(Boolean).join('\n');
}

function buildHtmlBody(inquiryId, inquiry) {
  const basics = buildBasicsData(inquiry);
  const basicCards = basics
    .filter((item) => item.key !== 'homeSummary')
    .map((item) => buildMetaCard(item.label, item.value))
    .join('');
  const homeSummary = basics.find((item) => item.key === 'homeSummary')?.value || '';

  return `
    <div style="background:#f5f1e8;padding:24px;">
      <div style="font-family:Arial,sans-serif;color:#223029;line-height:1.6;max-width:760px;margin:0 auto;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e8e0d2;">
        <div style="background:#314d40;color:#ffffff;padding:24px 28px;">
          <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.85;">Aspenleaf Shelties</p>
          <h1 style="font-size:26px;line-height:1.2;margin:0;">New Inquiry Received</h1>
          <p style="margin:10px 0 0;font-size:15px;opacity:0.92;">A new ${escapeHtml(formatSource(inquiry.source).toLowerCase())} has been submitted.</p>
        </div>

        <div style="padding:24px 28px;">
          <h2 style="margin:0 0 12px;font-size:18px;color:#2f4a3d;">Contact</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:24px;">
            ${buildMetaCard(EMAIL_LABELS.name, inquiry.fullName)}
            ${buildMetaCard(EMAIL_LABELS.email, inquiry.email)}
            ${buildMetaCard(EMAIL_LABELS.phone, inquiry.phone)}
            ${buildMetaCard(EMAIL_LABELS.location, inquiry.location)}
          </div>

          <h2 style="margin:0 0 12px;font-size:18px;color:#2f4a3d;">Basics</h2>
          <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin-bottom:24px;">
            ${basicCards}
          </div>

          ${homeSummary ? `
            <div style="margin-bottom:24px;">
              <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;margin-bottom:8px;">${escapeHtml(EMAIL_LABELS.homeSummary)}</div>
              <div style="white-space:pre-wrap;background:#f8f5ef;border:1px solid #ece3d6;border-radius:14px;padding:14px 16px;">${escapeHtml(homeSummary)}</div>
            </div>
          ` : ''}

          <p style="margin:24px 0 0;color:#6b6b6b;font-size:13px;">Inquiry ID: ${escapeHtml(inquiryId)}</p>
        </div>
      </div>
    </div>
  `;
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatInterest(value) {
  const labels = {
    puppy: 'Puppy',
    adult: 'Adult',
    either: 'Open to either',
  };

  return labels[value] || capitalize(String(value || 'either'));
}

function formatSource(value) {
  return value === 'questionnaire-page' ? 'Questionnaire' : 'Inquiry';
}

function buildMetaCard(label, value) {
  return `
    <div style="background:#f8f5ef;border:1px solid #ece3d6;border-radius:14px;padding:12px 14px;">
      <div style="font-size:11px;letter-spacing:0.08em;text-transform:uppercase;color:#6b6b6b;margin-bottom:4px;">${escapeHtml(label)}</div>
      <div style="font-size:15px;color:#223029;font-weight:600;">${escapeHtml(value || 'Not provided')}</div>
    </div>
  `;
}

const EMAIL_LABELS = {
  name: 'Name',
  email: 'Email',
  phone: 'Phone',
  location: 'Location',
  interest: 'Interested In',
  sexPreference: 'Sex Preference',
  colorPreference: 'Color Preference',
  previousSheltieOwnership: 'Have You Owned a Sheltie Before?',
  homeSummary: 'Tell us a little about your home, household, and what you are hoping for.',
};

function buildBasicsData(inquiry) {
  return [
    { key: 'interest', label: EMAIL_LABELS.interest, value: formatInterest(inquiry.interest) },
    {
      key: 'sexPreference',
      label: EMAIL_LABELS.sexPreference,
      value: formatSexPreference(inquiry.questionnaire?.sexPreference),
    },
    {
      key: 'colorPreference',
      label: EMAIL_LABELS.colorPreference,
      value: formatColorPreference(inquiry.questionnaire?.colorPreference),
    },
    {
      key: 'previousSheltieOwnership',
      label: EMAIL_LABELS.previousSheltieOwnership,
      value: formatPreviousSheltieOwnership(inquiry.questionnaire?.previousSheltieOwnership),
    },
    {
      key: 'homeSummary',
      label: EMAIL_LABELS.homeSummary,
      value: inquiry.questionnaire?.homeSummary || '',
    },
  ];
}

function buildBasicsLines(inquiry) {
  return buildBasicsData(inquiry)
    .filter((item) => item.value)
    .flatMap((item) => [item.label, item.value, ''])
    .slice(0, -1);
}

function formatSexPreference(value) {
  if (value === 'male') {
    return 'Male';
  }

  if (value === 'female') {
    return 'Female';
  }

  return 'No preference';
}

function formatColorPreference(value) {
  if (value === 'sable') {
    return 'Sable';
  }

  if (value === 'blue-merle') {
    return 'Blue merle';
  }

  if (value === 'tri-color-black') {
    return 'Tri-color / black';
  }

  return 'No preference';
}

function formatPreviousSheltieOwnership(value) {
  return value === 'yes' ? 'Yes' : 'No';
}

function toErrorMessage(error) {
  if (error instanceof Error) {
    return error.message.slice(0, 400);
  }

  return String(error).slice(0, 400);
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
