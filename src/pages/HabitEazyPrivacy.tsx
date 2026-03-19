import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function HabitEazyPrivacy() {
  usePageAnalytics('habiteazy-privacy', 'page_view_habiteazy_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Habit Eazy: Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 13th January 2025</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Introduction</h2>
          <p>This Privacy Policy explains how Habit Eazy: Habit &amp; To-Do Pal ("we," "our," or "the app") collects, uses, stores, and protects your personal information. We are committed to safeguarding your privacy in compliance with applicable regulations, including the General Data Protection Regulation (GDPR).</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Information We Collect</h2>
          <p>We may collect the following types of information:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Personal Identifiers: Name and email (if you sign in using Google, Apple, or email login). Optional.</li>
            <li>Device &amp; Usage Data: For crash reporting and analytics (via Firebase, Crashlytics, or equivalent).</li>
            <li>User-Generated Data: Habits, tasks, streaks, notes, and progress data created by the user.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">3. Purpose of Data Collection</h2>
          <p>We use collected data to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide habit tracking and task management functionality.</li>
            <li>Sync and personalize your habits and progress across devices.</li>
            <li>Deliver push notification reminders.</li>
            <li>Enhance app performance and stability.</li>
            <li>Monitor crashes, detect bugs, and improve the user experience.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">4. Data Sharing and Third Parties</h2>
          <p>Some data may be shared with trusted third-party services:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Firebase &amp; Crashlytics: For analytics, error reporting, and performance monitoring.</li>
            <li>Authentication Providers: (Google, Apple) for login.</li>
            <li>Cloud Hosting Providers: For secure storage and syncing.</li>
          </ul>
          <p>We do not sell or trade your data to third parties under any circumstances.</p>

          <h2 className="text-lg font-bold text-foreground font-display">5. Data Security</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>All data is encrypted in transit (SSL) and at rest.</li>
            <li>Access to personal data is restricted to authorized personnel only.</li>
            <li>We apply industry-standard security measures.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">6. Your Rights Under GDPR</h2>
          <p>If you are an EU/EEA resident, you have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access, correct, or delete your data.</li>
            <li>Request data portability.</li>
            <li>Object to or restrict certain types of processing.</li>
            <li>Withdraw consent at any time.</li>
            <li>File a complaint with your local data protection authority.</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">7. Data Retention</h2>
          <p>We retain your data only as long as necessary to provide app services or as required by law. You may request deletion of your account and associated data at any time.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. International Data Transfers</h2>
          <p>Your data may be processed or stored outside your country of residence, including in the United States. Where applicable, we rely on Standard Contractual Clauses and other safeguards.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Children's Privacy</h2>
          <p>Habit Eazy is not directed at children under 13 years of age. We do not knowingly collect personal information from minors.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. User Content Ownership</h2>
          <p>You retain full ownership of all habits, tasks, and information you create. By using the app, you grant us a limited license to process this data solely for app functionality and service improvement.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. Consent and Withdrawal</h2>
          <p>By using Habit Eazy, you consent to this Privacy Policy. You may withdraw your consent at any time by deleting your data or uninstalling the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. Changes to Privacy Policy</h2>
          <p>We may update this Privacy Policy periodically. Significant changes will be communicated via in-app notifications or email.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Data Breach Protocol</h2>
          <p>In the event of a data breach, we will promptly notify affected users and relevant authorities in line with GDPR and other applicable regulations.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Contact Information</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited</p>
          <p>Address: India</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Effective Date</h2>
          <p>This Privacy Policy is effective as of the date above and applies to all users of the Habit Eazy app.</p>
        </div>
      </div>
    </section>
  );
}
