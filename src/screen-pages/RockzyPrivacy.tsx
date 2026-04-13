import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function RockzyPrivacy() {
  usePageAnalytics('rockzy-privacy', 'page_view_rockzy_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Rockzy: AI Rock Identifier – Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 2 February 2026</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Introduction</h2>
          <p>This Privacy Policy explains how Rockzy: AI Rock Identifier ("Rockzy", "we", "us") collects, uses, stores, and protects information when you use the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Identifiers &amp; Account Data: Firebase anonymous ID (guest users). If you sign in, we collect name/email via Google, Apple, or email sign-in.</li>
            <li>Images: Photos you upload for identification; images you attach in AI Chat (if used).</li>
            <li>User Content: Collections, notes, and public community posts/comments.</li>
            <li>Reports: Report reasons and an identifier to manage abuse and moderation.</li>
            <li>Device &amp; Usage Data: Analytics (Firebase Analytics, GA4) and crash reports (Crashlytics).</li>
          </ul>
          <p>We do not collect location data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">3. Purpose of Data Collection</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide rock identification using our backend CNN model</li>
            <li>Provide AI Chat responses using Gemini (via our server)</li>
            <li>Maintain collections and community features</li>
            <li>Improve stability and app performance</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">4. Data Sharing and Third Parties</h2>
          <p>We share data only with service providers needed to operate Rockzy:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Gemini (AI Chat processing)</li>
            <li>Firebase (authentication/anonymous IDs, analytics, and related infrastructure)</li>
            <li>GA4 (analytics)</li>
            <li>Crashlytics (crash reporting)</li>
          </ul>
          <p>We do not sell your data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">5. Data Security</h2>
          <p>We use reasonable safeguards to protect your data, including encryption in transit and access controls.</p>

          <h2 className="text-lg font-bold text-foreground font-display">6. Your Rights Under GDPR</h2>
          <p>If you are an EU/EEA resident, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your data</li>
            <li>Object to processing or request restriction</li>
            <li>Request data portability (where applicable)</li>
            <li>Withdraw consent at any time</li>
            <li>File a complaint with a data protection authority</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">7. Data Retention</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Identification images are stored on our servers and may be used to improve the identification model.</li>
            <li>AI Chat history is stored for up to 30 days and then deleted (TTL).</li>
            <li>Other stored data is retained only as needed and may also be subject to TTL based retention.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">8. International Data Transfers</h2>
          <p>Your data may be processed or stored outside your country, including in the United States. We use appropriate safeguards where required.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Children's Privacy</h2>
          <p>Rockzy is not directed at children under 13, and we do not knowingly collect data from minors.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. User Content Ownership</h2>
          <p>You retain ownership of content you upload or post. You grant Rockzy permission to use it only for app functionality, community operation, and improving the identification feature.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. Consent and Withdrawal</h2>
          <p>By using Rockzy, you consent to this Privacy Policy. You may withdraw consent by deleting your data using in-app controls or contacting us.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time. The "Last Updated" date will reflect changes.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Data Breach Protocol</h2>
          <p>If a data breach occurs, we will notify affected users and authorities as required by applicable law.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Contact Information</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited</p>
          <p>Address: India</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Effective Date</h2>
          <p>This Privacy Policy is effective as of the date stated above and applies to all users of Rockzy: AI Rock Identifier.</p>
        </div>
      </div>
    </section>
  );
}
