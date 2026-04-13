import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function TrackzioPrivacy() {
  usePageAnalytics('trackzio-privacy', 'page_view_trackzio_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Trackzio Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 12 March 2026</p>

          <h2 className="text-lg font-bold text-foreground font-display">Introduction</h2>
          <p>Trackzio Mobile Application Private Limited builds mobile applications focused on identification tools, hobby communities, and productivity solutions.</p>
          <p>This Privacy Policy explains how we collect, use, and protect user data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Services Covered</h2>
          <p>This policy applies to Trackzio apps and websites including identification apps and productivity tools.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Information We Collect</h2>

          <h3 className="text-base font-semibold text-foreground">Account Information</h3>
          <p>Name and email when signing in.</p>

          <h3 className="text-base font-semibold text-foreground">Content Provided by Users</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Photos uploaded for identification</li>
            <li>Collections and notes</li>
            <li>Community posts</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">Device Information</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Device type</li>
            <li>Operating system</li>
            <li>App version</li>
            <li>Crash reports</li>
          </ul>

          <h3 className="text-base font-semibold text-foreground">Images for AI Identification</h3>
          <p>Users may upload images which are processed by machine learning models.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Information We Do Not Collect</h2>
          <p>Trackzio does not collect precise location data unless required for a specific feature.</p>

          <h2 className="text-lg font-bold text-foreground font-display">How We Use Information</h2>
          <p>Data is used to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Provide app functionality</li>
            <li>Process AI identification requests</li>
            <li>Maintain user collections</li>
            <li>Improve machine learning models</li>
            <li>Improve app performance</li>
            <li>Detect abuse and security issues</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">Third Party Services</h2>
          <p>Trackzio may use trusted providers including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Firebase</li>
            <li>Google Analytics</li>
            <li>Firebase Crashlytics</li>
            <li>Cloud hosting providers</li>
            <li>AI model providers</li>
          </ul>
          <p>Trackzio does not sell personal data.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Data Security</h2>
          <p>We use encryption, secure authentication, and infrastructure security practices.</p>
          <p>However, no system can guarantee complete security.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Data Retention</h2>
          <p>Data is stored only as long as necessary to operate services and improve systems.</p>

          <h2 className="text-lg font-bold text-foreground font-display">International Data Transfers</h2>
          <p>Data may be processed on servers outside your country including the United States.</p>

          <h2 className="text-lg font-bold text-foreground font-display">User Rights</h2>
          <p>Depending on location, users may request:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Access to data</li>
            <li>Correction</li>
            <li>Deletion</li>
            <li>Data portability</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">Children's Privacy</h2>
          <p>Trackzio services are not intended for children under 13.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Changes to Policy</h2>
          <p>We may update this policy from time to time.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Contact Information</h2>
          <p>Trackzio Mobile Application Private Limited</p>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Location: India</p>
        </div>
      </div>
    </section>
  );
}
