/**
 * Generates initial legal markdown files under content/apps/legal/{appId}/.
 * Run: node scripts/write-app-legal-md.mjs
 * Edit those .md files as the source of truth for Privacy / Terms.
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const legalRoot = path.join(root, "content/apps/legal");

function write(appId, name, body) {
  const dir = path.join(legalRoot, appId);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), body.trimEnd() + "\n", "utf8");
}

const contact = `
## Contact

Email: [developer@trackzio.com](mailto:developer@trackzio.com)

Company: Trackzio Mobile Application Private Limited

Address: India
`;

const termsTemplate = (opts) => `---
title: "${opts.title}"
lastUpdated: "${opts.updated}"
analyticsPage: "${opts.analyticsPage}"
analyticsEvent: "${opts.analyticsEvent}"
---

## 1. Agreement to Terms

By using ${opts.appName} ("the App"), you agree to these Terms of Service. If you do not agree, do not use the app.

## 2. Eligibility

You must be at least 13 years old to use the App. If you are under 18, you must have parental or guardian consent.

## 3. App Services

The App provides the features described in the store listing and in-app, including AI-powered identification and related tools, subject to change with updates.

## 4. User Responsibilities

You are responsible for any activity under your account, keeping credentials secure, and using the App lawfully and respectfully, including any community features.

## 5. Community Rules

If the App includes community features, you agree not to post illegal, harmful, abusive, or infringing content; harass others; impersonate anyone; or spam. We may remove content or restrict access to maintain safety.

## 6. Intellectual Property

Branding, app design, and features are owned by Trackzio Mobile Application Private Limited unless otherwise stated.

## 7. User-Generated Content

You retain ownership of content you upload. You grant us a license to use this content only to operate, maintain, and improve the service (including improving identification features), and to display community posts within the App where applicable.

## 8. Accuracy of Information

Identification results and AI features are estimates and may be incorrect. The App is for informational and educational purposes only. You should independently verify any critical information.

## 9. Termination

We may suspend or terminate accounts or limit access if you violate these Terms or misuse the App.

## 10. Modifications

We may update the App or these Terms at any time. Continued use after changes means you accept the updated Terms.

## 11. In-App Purchases

Some features may require payment. Prices and features may change and will be shown at the time of purchase.

## 12. No Refund Policy

All purchases are final and non-refundable, except where refunds are required by law or platform policies.

## 13. Disclaimers

The App is provided "as is." We do not guarantee uninterrupted availability, accuracy, or uptime. Use is at your own risk.

## 14. Limitation of Liability

To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of the App.

## 15. Governing Law

These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the courts of Gujarat, India.

${contact}
`;

const privacyTemplate = (opts) => `---
title: "${opts.title}"
lastUpdated: "${opts.updated}"
analyticsPage: "${opts.analyticsPage}"
analyticsEvent: "${opts.analyticsEvent}"
---

## 1. Introduction

This Privacy Policy explains how ${opts.appName} ("we," "our," or "the app") collects, uses, stores, and protects your personal information. We are committed to safeguarding your privacy and ensuring compliance with applicable regulations, including the General Data Protection Regulation (GDPR) where applicable.

## 2. Information We Collect

We may collect:

- **Account data:** if you sign in (e.g. email, name, OAuth identifiers).
- **Content you provide:** photos uploaded for identification, collections, notes, and community posts.
- **Device and usage data:** diagnostics, crash reports, and analytics to improve stability.
- **Approximate location** only if you choose to provide it or where needed for product features.

## 3. How We Use Information

We use data to provide core features, improve AI models and product quality, operate communities and marketplaces where applicable, communicate with you, and comply with law.

## 4. Third Parties

We may use trusted providers (e.g. cloud hosting, authentication, AI inference, analytics). We do not sell your personal data.

## 5. Security

We use industry-standard safeguards including encryption in transit and access controls. No method is 100% secure.

## 6. Your Rights

Depending on your region, you may have rights to access, correct, delete, or export your data, and to object to certain processing. Contact us using the details below.

## 7. Children

The App is not directed at children under 13. We do not knowingly collect personal information from minors without appropriate consent.

## 8. International Transfers

Your data may be processed in countries outside your residence. Where required, we use appropriate safeguards.

## 9. Changes

We may update this policy. Material changes will be communicated via the App or other reasonable means.

${contact}
`;

// --- Insecto (full privacy migrated from former screen) ---
write(
  "insecto",
  "privacy.md",
  `---
title: "Insecto AI: Bug Identifier — Privacy Policy"
lastUpdated: "4th September 2025"
analyticsPage: "insecto-privacy"
analyticsEvent: "page_view_insecto_privacy"
---

## 1. Introduction

This Privacy Policy explains how Insecto AI: Bug Identifier ("we," "our," or "the app") collects, uses, stores, and protects your personal information. We are committed to safeguarding your privacy and ensuring compliance with applicable regulations, including the General Data Protection Regulation (GDPR).

## 2. Information We Collect

We may collect the following types of information:

- **Insect images:** Uploaded by users to identify insects using AI (processed via Google Gemini, OpenAI, or similar services).
- **Personal identifiers:** Name and email (if you sign in using Google, Apple, or email login). Optional.
- **Device & usage data:** For crash reporting and analytics (via Firebase, Crashlytics, or equivalent).
- **User-generated data:** Collections, notes, favorites, and identification history created by the user.
- **Community data:** Posts, comments, and interactions on the in-app feed (if you use community features).
- **Approximate location (if provided):** May be used to improve identification results by narrowing species to your region.

## 3. Purpose of Data Collection

We use collected data to:

- Provide AI-powered insect identification results.
- Save and personalize your insect collections.
- Deliver informational bite safety content.
- Enhance app performance and functionality.
- Support community features (posts, comments, likes).
- Monitor crashes, detect bugs, and improve stability.

## 4. Data Sharing and Third Parties

Some data may be shared with trusted third-party services:

- **AI services:** For insect image recognition and classification.
- **Firebase & Crashlytics:** For analytics, error reporting, and performance monitoring.
- **Authentication providers:** (Google, Apple) for login.
- **Cloud hosting providers:** For secure storage and syncing of your collections.

We do not sell or trade your data to third parties under any circumstances.

## 5. Data Security

- All data is encrypted in transit (SSL) and at rest.
- Access to personal data is restricted to authorized personnel only.
- We apply industry-standard security measures, including firewalls and secure storage practices.

## 6. Your Rights Under GDPR

If you are an EU/EEA resident, you have the right to:

- Access, correct, or delete your data.
- Request data portability.
- Object to or restrict certain types of processing.
- Withdraw consent at any time.
- File a complaint with your local data protection authority.

## 7. Data Retention

We retain your data only as long as necessary to provide app services or as required by law. You may request deletion of your account and associated data at any time.

## 8. International Data Transfers

Your data may be processed or stored outside your country of residence, including in the United States. Where applicable, we rely on Standard Contractual Clauses and other safeguards to ensure adequate protection.

## 9. Children's Privacy

Insecto AI: Bug Identifier is not directed at children under 13 years of age. We do not knowingly collect personal information from minors.

## 10. User Content Ownership

You retain full ownership of all insect images, posts, and information you upload. By using the app, you grant us a limited license to process this data solely for app functionality, personalization, and service improvement.

## 11. Consent and Withdrawal

By using Insecto AI: Bug Identifier, you consent to this Privacy Policy. You may withdraw your consent at any time by deleting your data or uninstalling the app.

## 12. Changes to Privacy Policy

We may update this Privacy Policy periodically. Significant changes will be communicated via in-app notifications or email.

## 13. Data Breach Protocol

In the event of a data breach, we will promptly notify affected users and relevant authorities in line with GDPR and other applicable regulations.

## 14. Health and Safety Disclaimer

Insecto AI: Bug Identifier may provide informational content regarding insect bites, stings, and related safety advice. This information is for general educational purposes only and is not intended as medical advice. We do not guarantee the accuracy, completeness, or timeliness of health-related information provided by the App. Always seek the advice of a qualified healthcare professional with any questions you may have regarding a medical condition or treatment. In case of emergency, call your local emergency number immediately.

## 15. Contact Information

Email: [developer@trackzio.com](mailto:developer@trackzio.com)

Company: Trackzio Mobile Application Private Limited

Address: India

## 16. Effective Date

This Privacy Policy is effective as of the date above and applies to all users of the Insecto AI: Bug Identifier app.
`,
);

write(
  "insecto",
  "terms.md",
  termsTemplate({
    title: "Insecto AI: Bug Identifier — Terms of Service",
    updated: "4th September 2025",
    analyticsPage: "insecto-terms",
    analyticsEvent: "page_view_insecto_terms",
    appName: "Insecto AI: Bug Identifier",
  }),
);

// --- Rockzy ---
write(
  "rockzy",
  "terms.md",
  `---
title: "Rockzy: AI Rock Identifier — Terms of Service"
lastUpdated: "2 February 2026"
analyticsPage: "rockzy-terms"
analyticsEvent: "page_view_rockzy_terms"
---

## 1. Agreement to Terms

By using Rockzy: AI Rock Identifier ("Rockzy"), you agree to be bound by these Terms of Service. If you do not agree, do not use the app.

## 2. Eligibility

You must be at least 13 years old to use Rockzy. If you are under 18, you must have parental or guardian consent.

## 3. App Services

Rockzy provides:

- AI-powered rock/mineral identification (via our backend model)
- Collection and history features
- AI Chat for rock/mineral questions
- A public community to share posts and interact with other users

## 4. User Responsibilities

You are responsible for:

- Any activity under your account (including guest usage tied to an anonymous ID)
- Keeping your login credentials confidential if you create an account
- Using Rockzy lawfully and respectfully, including within the community

## 5. Community Rules

Because Rockzy includes a public community, you agree not to:

- Post illegal, harmful, abusive, or infringing content
- Harass others, impersonate anyone, or spam
- Upload content you do not have the rights to share

We may remove content or restrict access to maintain community safety.

## 6. Intellectual Property

All branding, app design, and features of Rockzy are owned by Trackzio Mobile Application Private Limited and protected by applicable intellectual property laws.

## 7. User-Generated Content

You retain ownership of content you upload (images, posts, notes). You grant us a license to use this content only to operate, maintain, and improve the service (including improving identification features), and to display community posts within the app.

## 8. Accuracy of Information

Identification results and AI Chat responses are estimates and may be incorrect. Rockzy is for informational and educational purposes only. You should independently verify any critical information.

## 9. Termination

We may suspend or terminate accounts, or limit access (including community access), if you violate these Terms or misuse the app.

## 10. Modifications

We may update the app or these Terms at any time. Continued use after changes means you accept the updated Terms.

## 11. In-App Purchases

Some features may require payment. Prices and features may change and will be shown at the time of purchase.

## 12. No Refund Policy

All purchases are final and non-refundable, except where refunds are required by law or platform policies.

## 13. Disclaimers

Rockzy is provided "as is." We do not guarantee uninterrupted availability, accuracy, or uptime. Use is at your own risk.

## 14. Limitation of Liability

To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of Rockzy.

## 15. Governing Law

These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the Gujarat High Court, India.

## 16. Contact

Email: [developer@trackzio.com](mailto:developer@trackzio.com)

Company: Trackzio Mobile Application Private Limited

Address: Gujarat, India
`,
);

write(
  "rockzy",
  "privacy.md",
  privacyTemplate({
    title: "Rockzy: AI Rock Identifier — Privacy Policy",
    updated: "2 February 2026",
    analyticsPage: "rockzy-privacy",
    analyticsEvent: "page_view_rockzy_privacy",
    appName: "Rockzy: AI Rock Identifier",
  }),
);

// --- Coinzy, Banknotes, Habiteazy ---
for (const { id, name, short } of [
  { id: "coinzy", name: "Coinzy: AI Coin Identifier", short: "Coinzy" },
  { id: "banknotes", name: "Banknotes: Banknote Identification AI", short: "Banknotes" },
  { id: "habiteazy", name: "Habiteazy: Habit & To-Do", short: "Habiteazy" },
]) {
  write(
    id,
    "privacy.md",
    privacyTemplate({
      title: `${name} — Privacy Policy`,
      updated: "12 March 2026",
      analyticsPage: `${id}-privacy`,
      analyticsEvent: `page_view_${id.replace(/-/g, "_")}_privacy`,
      appName: short,
    }),
  );
  write(
    id,
    "terms.md",
    termsTemplate({
      title: `${name} — Terms of Service`,
      updated: "12 March 2026",
      analyticsPage: `${id}-terms`,
      analyticsEvent: `page_view_${id.replace(/-/g, "_")}_terms`,
      appName: short,
    }),
  );
}

console.log("Wrote legal markdown under", legalRoot);
