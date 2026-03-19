import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function CoinzyPrivacy() {
  usePageAnalytics('coinzy-privacy', 'page_view_coinzy_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Coinzy – Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 17th April 2025</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Introduction</h2>
          <p>This Privacy Policy outlines how Coinzy collects, uses, stores, and protects your personal information. We comply with GDPR and applicable laws.</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Information We Collect</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Coin Images (processed via AI such as Google Gemini)</li>
            <li>Personal Identifiers (Name, Email via Google Sign-In)</li>
            <li>Device &amp; Usage Data (Firebase, Crashlytics)</li>
            <li>User Data (collections, metadata)</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">3. Purpose of Data</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI coin identification</li>
            <li>Personalization</li>
            <li>App improvement</li>
            <li>Bug tracking</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">4. Data Sharing</h2>
          <p>Shared with trusted services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI services</li>
            <li>Firebase &amp; Crashlytics</li>
            <li>Authentication providers</li>
          </ul>
          <p>We do not sell data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">5. Data Security</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Encryption in transit and at rest</li>
            <li>Restricted access</li>
            <li>Secure infrastructure</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">6. User Rights (GDPR)</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, delete, correct data</li>
            <li>Withdraw consent</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">7. Data Retention</h2>
          <p>Stored only as long as necessary.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. International Transfers</h2>
          <p>Data may be stored outside EEA with safeguards.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Children's Privacy</h2>
          <p>Not for users under 13.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. User Content Ownership</h2>
          <p>Users retain ownership. App gets limited usage rights.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. Consent</h2>
          <p>Using the app means consent.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. Changes</h2>
          <p>We may update policy.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Data Breach Protocol</h2>
          <p>Users will be notified if required.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Contact</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited</p>
          <p>Address: India</p>
        </div>
      </div>
    </section>
  );
}
