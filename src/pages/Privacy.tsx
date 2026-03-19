import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Privacy() {
  usePageAnalytics('privacy', 'page_view_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Trackzio Mobile Application Private Limited – Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 12 March 2026</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Introduction</h2>
          <p>Trackzio Mobile Application Private Limited ("Trackzio", "we", "us", or "our") builds and operates mobile applications focused on identification tools, hobbyist communities, and productivity solutions.</p>
          <p>This Privacy Policy explains how we collect, use, store, and protect information when you use:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>our mobile applications</li>
            <li>our websites</li>
            <li>services operated by Trackzio</li>
          </ul>
          <p>Individual apps may have app-specific privacy policies that provide additional details relevant to that product.</p>
          <p>By using Trackzio services, you agree to the practices described in this Privacy Policy.</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Services Covered</h2>
          <p>This policy applies to services developed or operated by Trackzio, including but not limited to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>identification apps (e.g., coin, rock, insect, plant, bird, or other identifier apps)</li>
            <li>hobbyist catalog and collection apps</li>
            <li>productivity or habit-tracking applications</li>
            <li>Trackzio websites and related services</li>
          </ul>
          <p>Some apps may have additional privacy notices that supplement this policy.</p>

          <h2 className="text-lg font-bold text-foreground font-display">3. Information We Collect</h2>
          <p>We collect information necessary to operate our services effectively.</p>

          <h3 className="text-base font-semibold text-foreground">3.1 Account and Identity Information</h3>
          <p>Depending on the service you use, we may collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Firebase anonymous identifier (for guest users)</li>
            <li>Name and email (if you sign in using Google, Apple, or email)</li>
            <li>User account identifiers</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">3.2 Content You Provide</h3>
          <p>Users may provide content within our apps, such as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>photos uploaded for identification</li>
            <li>collections, catalog entries, or notes</li>
            <li>community posts, comments, or listings</li>
            <li>messages sent through in-app AI chat features</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">3.3 Device and Usage Data</h3>
          <p>We may collect technical and usage information including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>device type and operating system</li>
            <li>app version</li>
            <li>crash reports</li>
            <li>interaction events and analytics data</li>
          </ul>
          <p>This information helps us understand how users interact with our services.</p>

          <h3 className="text-base font-semibold text-foreground">3.4 Images and Identification Data</h3>
          <p>For identification apps, users may upload images for processing by machine learning models. These images may be stored temporarily or longer depending on the product and its improvement processes.</p>

          <h3 className="text-base font-semibold text-foreground">3.5 Reports and Moderation Data</h3>
          <p>If you report content or users, we collect:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>report reason</li>
            <li>identifiers needed to review and moderate content</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">3.6 Information We Do Not Collect</h3>
          <p>Unless explicitly required for a specific service, Trackzio does not collect precise location data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">4. How We Use Information</h2>
          <p>We use collected information to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>provide core app functionality</li>
            <li>process identification requests using machine learning models</li>
            <li>provide AI-based chat or assistant features</li>
            <li>maintain user collections, communities, and marketplace features</li>
            <li>improve app quality and accuracy of models</li>
            <li>analyze usage trends and improve product performance</li>
            <li>detect abuse, fraud, or security issues</li>
            <li>maintain service reliability and stability</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">5. Third-Party Services</h2>
          <p>We rely on trusted third-party infrastructure providers to operate our services. These may include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Firebase – authentication, analytics, and infrastructure</li>
            <li>Google Analytics (GA4) – usage analytics</li>
            <li>Firebase Crashlytics – crash reporting</li>
            <li>Google Gemini or other AI services – AI chat processing</li>
            <li>Cloud hosting providers – backend infrastructure</li>
          </ul>
          <p>These providers process data only as necessary to provide their services.</p>
          <p>Trackzio does not sell personal data to third parties.</p>

          <h2 className="text-lg font-bold text-foreground font-display">6. Data Security</h2>
          <p>We use reasonable technical and organizational safeguards to protect user data, including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>encryption in transit</li>
            <li>controlled backend access</li>
            <li>authentication mechanisms</li>
            <li>infrastructure security provided by cloud platforms</li>
          </ul>
          <p>However, no internet service can guarantee absolute security.</p>

          <h2 className="text-lg font-bold text-foreground font-display">7. Data Retention</h2>
          <p>Data is retained only as long as necessary to provide services or improve our systems. Typical retention practices may include:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>identification images used to improve models</li>
            <li>AI chat logs retained temporarily and deleted based on TTL policies</li>
            <li>analytics and crash data retained according to platform retention rules</li>
          </ul>
          <p>Retention policies may vary between services.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. International Data Transfers</h2>
          <p>Trackzio services may process or store data on servers located outside your country, including the United States or other regions where our service providers operate.</p>
          <p>We rely on appropriate safeguards when transferring data internationally.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Your Rights</h2>
          <p>Depending on your location, you may have the right to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>access your personal data</li>
            <li>request correction of inaccurate information</li>
            <li>request deletion of your data</li>
            <li>object to certain data processing</li>
            <li>request restriction of processing</li>
            <li>request data portability where applicable</li>
          </ul>
          <p>Requests may be submitted using the contact information below.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. Children's Privacy</h2>
          <p>Trackzio services are not directed toward children under 13.</p>
          <p>We do not knowingly collect personal information from children under 13. If we become aware of such data, we will take steps to remove it.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. User Content Ownership</h2>
          <p>Users retain ownership of content they upload to Trackzio services.</p>
          <p>By uploading content, you grant Trackzio permission to use it solely for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>providing app functionality</li>
            <li>operating community features</li>
            <li>improving identification systems and product features</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">12. Changes to This Privacy Policy</h2>
          <p>We may update this Privacy Policy from time to time.</p>
          <p>If changes occur, we will update the "Last Updated" date.</p>
          <p>Continued use of Trackzio services after updates constitutes acceptance of the revised policy.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Data Breach Protocol</h2>
          <p>In the event of a data breach affecting personal information, Trackzio will notify affected users and relevant authorities as required by applicable law.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Contact Information</h2>
          <p>For privacy-related inquiries or data requests, contact:</p>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited<br />India</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Effective Date</h2>
          <p>This Privacy Policy is effective as of the date listed above and applies to all Trackzio services.</p>
        </div>
      </div>
    </section>
  );
}
