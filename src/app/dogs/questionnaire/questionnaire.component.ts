import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';

import { InquirySubmissionInput, InquirySubmissionService } from '../../firebase/inquiry-submission.service';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css'],
  imports: [
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    RouterLink,
  ],
  standalone: true,
})
export class QuestionnaireComponent {
  submissionState: 'idle' | 'submitting' | 'success' | 'error' = 'idle';
  submissionError = '';
  private formStartedAt = Date.now();
  private readonly minimumCompletionMs = 4000;
  private readonly repeatSubmissionDelayMs = 120000;

  readonly questionnaireForm = this.formBuilder.nonNullable.group({
    primaryName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(120)]],
    phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
    location: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(80)]],
    interest: ['puppy', [Validators.required]],
    sexPreference: ['no-preference', [Validators.required]],
    colorPreference: ['no-preference', [Validators.required]],
    previousSheltieOwnership: ['no', [Validators.required]],
    homeSummary: ['', [Validators.maxLength(600)]],
    returnToBreederAgreement: [false, [Validators.requiredTrue]],
    breedingContractAcknowledgement: [false, [Validators.requiredTrue]],
    website: [''],
  });

  constructor(
    private formBuilder: FormBuilder,
    private inquirySubmissionService: InquirySubmissionService,
  ) {}

  submitQuestionnaire() {
    this.submissionError = '';

    if (this.questionnaireForm.invalid) {
      this.questionnaireForm.markAllAsTouched();
      this.submissionState = 'error';
      this.submissionError =
        'Please complete the required fields and check both acknowledgement boxes before submitting.';
      return;
    }

    const formValue = this.questionnaireForm.getRawValue();
    if (formValue.website.trim()) {
      this.completeSuccessfulSubmission();
      return;
    }

    if (Date.now() - this.formStartedAt < this.minimumCompletionMs) {
      this.submissionError = 'Please take a moment to review the form before submitting.';
      return;
    }

    if (this.wasRecentlySubmitted()) {
      this.submissionError = 'Thanks. Please wait a minute or two before sending another questionnaire.';
      return;
    }

    const submission: InquirySubmissionInput = {
      fullName: formValue.primaryName,
      email: formValue.email,
      phone: formValue.phone,
      location: formValue.location,
      interest: formValue.interest as InquirySubmissionInput['interest'],
      message: this.composeSummary(formValue),
      source: 'questionnaire-page',
      questionnaire: {
        primaryName: formValue.primaryName,
        sexPreference: formValue.sexPreference,
        colorPreference: formValue.colorPreference,
        previousSheltieOwnership: formValue.previousSheltieOwnership,
        homeSummary: formValue.homeSummary,
        returnToBreederAgreement: formValue.returnToBreederAgreement,
        breedingContractAcknowledgement: formValue.breedingContractAcknowledgement,
      },
    };

    this.submissionState = 'submitting';
    this.inquirySubmissionService.submitInquiry(submission).subscribe({
      next: () => this.completeSuccessfulSubmission(),
      error: () => {
        this.submissionState = 'error';
        this.submissionError =
          'Something went wrong while sending your questionnaire. Please try again or email Aspenleaf directly.';
      },
    });
  }

  private composeSummary(formValue: ReturnType<typeof this.questionnaireForm.getRawValue>): string {
    const summaryLines = [];

    if (formValue.interest !== 'puppy') {
      summaryLines.push(`Interest: ${formValue.interest}`);
    }

    if (formValue.sexPreference !== 'no-preference') {
      summaryLines.push(`Sex preference: ${formValue.sexPreference}`);
    }

    if (formValue.colorPreference !== 'no-preference') {
      summaryLines.push(`Color preference: ${formValue.colorPreference}`);
    }

    if (formValue.previousSheltieOwnership === 'yes') {
      summaryLines.push('Owned a Sheltie before: yes');
    }

    if (formValue.homeSummary) {
      summaryLines.push(`Home summary: ${formValue.homeSummary}`);
    }

    return summaryLines.join('\n\n');
  }

  private completeSuccessfulSubmission() {
    this.rememberSubmission();
    this.submissionState = 'success';
    this.submissionError = '';
    this.questionnaireForm.reset({
      primaryName: '',
      email: '',
      phone: '',
      location: '',
      interest: 'puppy',
      sexPreference: 'no-preference',
      colorPreference: 'no-preference',
      previousSheltieOwnership: 'no',
      homeSummary: '',
      returnToBreederAgreement: false,
      breedingContractAcknowledgement: false,
      website: '',
    });
    this.formStartedAt = Date.now();
  }

  private rememberSubmission() {
    globalThis.localStorage?.setItem('aspenleaf:lastInquiryAt', String(Date.now()));
  }

  private wasRecentlySubmitted(): boolean {
    const rawValue = globalThis.localStorage?.getItem('aspenleaf:lastInquiryAt');
    const lastSubmittedAt = rawValue ? Number(rawValue) : 0;
    return Number.isFinite(lastSubmittedAt) && Date.now() - lastSubmittedAt < this.repeatSubmissionDelayMs;
  }

  showError(controlName: keyof typeof this.questionnaireForm.controls): boolean {
    const control = this.questionnaireForm.controls[controlName];
    return !!control && control.invalid && (control.touched || control.dirty);
  }
}
