import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function BanknotePrivacy() {
  usePageAnalytics('banknote-privacy', 'page_view_banknote_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Banknote Identification AI: Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 14th May 2025</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Introduction</h2>
          <p>This Privacy Policy outlines how Banknote Identification AI collects, uses, stores, and protects your personal information. We are committed to maintaining the highest level of privacy and data security in compliance with applicable regulations, including the General Data Protection Regulation (GDPR).</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Banknote Images: Uploaded to identify banknotes using AI (processed via Google Gemini or similar services)</li>
            <li>Personal Identifiers: Email and name (collected via Google Sign-In). Optional</li>
            <li>Device &amp; Usage Data: For crash reporting and analytics (via Firebase and Crashlytics)</li>
            <li>User-Generated Data: Banknote metadata, identification logs, and collection entries</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">3. Purpose of Data Collection</h2>
          <p>We use the collected data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide AI-based banknote identification</li>
            <li>Sync and personalize your banknote collection</li>
            <li>Improve app functionality and user experience</li>
            <li>Monitor app performance and resolve bugs</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">4. Data Sharing and Third Parties</h2>
          <p>Some data may be shared with trusted third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI: For image recognition</li>
            <li>Firebase &amp; Crashlytics: For app analytics and crash monitoring</li>
            <li>Google Sign-In: For authentication purposes</li>
          </ul>
          <p>We do not sell your data under any circumstances.</p>

          <h2 className="text-lg font-bold text-foreground font-display">5. Data Security</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All data is encrypted in transit and at rest.</li>
            <li>Only essential personnel and systems have access to your data.</li>
            <li>We apply industry-standard firewalls and secure storage practices.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">6. Your Rights Under GDPR</h2>
          <p>If you are an EU/EEA resident, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your data</li>
            <li>Object to processing or request data portability</li>
            <li>Withdraw consent at any time</li>
            <li>File a complaint with a data protection authority</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">7. Data Retention</h2>
          <p>We retain your data only as long as necessary to provide our services or as required by law. You may request deletion of your data at any time.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. International Data Transfers</h2>
          <p>Your data may be processed or stored in countries outside the EEA, including the United States. We use Standard Contractual Clauses and other safeguards to ensure data protection.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Children's Privacy</h2>
          <p>Banknote Identification AI is not directed at children under the age of 13. We do not knowingly collect data from minors.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. User Content Ownership</h2>
          <p>You retain ownership of all images and information you upload. You grant us a license to use the data solely for app functionality, feature enhancement, and performance improvement.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. Consent and Withdrawal</h2>
          <p>By using Banknote Identification AI, you consent to this privacy policy. You may withdraw consent at any time by deleting your data or uninstalling the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. Significant changes will be communicated via in-app notifications or email.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Data Breach Protocol</h2>
          <p>In the unlikely event of a data breach, we will notify affected users and relevant authorities in accordance with GDPR requirements.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Contact Information</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited</p>
          <p>Address: India</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Effective Date</h2>
          <p>This Privacy Policy is effective as of the date stated above and applies to all users of the Banknote Identification AI app.</p>
        </div>
      </div>
    </section>
  );
}
