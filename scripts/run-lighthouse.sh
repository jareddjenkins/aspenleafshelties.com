#!/usr/bin/env sh
set -eu

usage() {
  echo "Usage: $0 <url> [mobile|desktop]" >&2
  exit 1
}

if [ $# -lt 1 ] || [ $# -gt 2 ]; then
  usage
fi

URL="$1"
FORM_FACTOR="${2:-mobile}"

case "$FORM_FACTOR" in
  mobile|desktop) ;;
  *)
    echo "Form factor must be 'mobile' or 'desktop'." >&2
    exit 1
    ;;
esac

TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
URL_SLUG="$(printf '%s' "$URL" | tr '/:?' '-' | tr -s '-' | tr -cd '[:alnum:]-')"
REPORT_DIR="reports/lighthouse"
REPORT_BASE="${REPORT_DIR}/${TIMESTAMP}-${FORM_FACTOR}-${URL_SLUG}"

mkdir -p "$REPORT_DIR"

if [ "$FORM_FACTOR" = "desktop" ]; then
  LIGHTHOUSE_FLAGS="--preset=desktop"
else
  LIGHTHOUSE_FLAGS=""
fi

docker run --rm \
  -v "$PWD":/workspace \
  -w /workspace \
  node:22-bookworm \
  sh -lc "
    set -eu
    export DEBIAN_FRONTEND=noninteractive
    apt-get update >/dev/null
    apt-get install -y chromium >/dev/null
    npx --yes lighthouse \"$URL\" \
      --quiet \
      --chrome-path=/usr/bin/chromium \
      --chrome-flags='--headless=new --no-sandbox --disable-dev-shm-usage' \
      --only-categories=performance,seo,best-practices,accessibility \
      --output=json \
      --output=html \
      --output-path=\"$REPORT_BASE\" \
      $LIGHTHOUSE_FLAGS >/tmp/lighthouse-run.log 2>&1
    node -e '
      const fs = require(\"fs\");
      const report = JSON.parse(fs.readFileSync(\"${REPORT_BASE}.report.json\", \"utf8\"));
      const categories = report.categories || {};
      const audits = report.audits || {};
      const score = (key) => {
        const value = categories[key]?.score;
        return typeof value === \"number\" ? Math.round(value * 100) : \"n/a\";
      };
      const metric = (key) => audits[key]?.displayValue || \"n/a\";
      console.log(\"URL:\", report.finalDisplayedUrl || \"$URL\");
      console.log(\"Form factor:\", \"$FORM_FACTOR\");
      console.log(\"Performance:\", score(\"performance\"));
      console.log(\"SEO:\", score(\"seo\"));
      console.log(\"Best Practices:\", score(\"best-practices\"));
      console.log(\"Accessibility:\", score(\"accessibility\"));
      console.log(\"FCP:\", metric(\"first-contentful-paint\"));
      console.log(\"LCP:\", metric(\"largest-contentful-paint\"));
      console.log(\"TBT:\", metric(\"total-blocking-time\"));
      console.log(\"CLS:\", metric(\"cumulative-layout-shift\"));
      console.log(\"SI:\", metric(\"speed-index\"));
    '
  "

echo ""
echo "Saved reports:"
echo "  ${REPORT_BASE}.report.html"
echo "  ${REPORT_BASE}.report.json"
