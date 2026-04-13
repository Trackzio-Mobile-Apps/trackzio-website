import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function TrackzioTerms() {
  usePageAnalytics('trackzio-terms', 'page_view_trackzio_terms');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Trackzio Terms of Service</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 12 March 2026</p>

          <h2 className="text-lg font-bold text-foreground font-display">Introduction</h2>
          <p>Welcome to Trackzio Mobile Application Private Limited ("Trackzio", "we", "our", or "us").</p>
          <p>These Terms of Service govern your access to and use of:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Trackzio mobile applications</li>
            <li>Trackzio websites</li>
            <li>Any services, features, or content operated by Trackzio</li>
          </ul>
          <p>By downloading, installing, accessing, or using any Trackzio service, you agree to be bound by these Terms.</p>
          <p>If you do not agree with these Terms, you should not use Trackzio services.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Services Covered</h2>
          <p>These Terms apply to all products and services developed or operated by Trackzio including:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI identification apps</li>
            <li>Hobby catalog and collection management apps</li>
            <li>Productivity and habit tracking apps</li>
            <li>Trackzio websites and related services</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">Eligibility</h2>
          <p>To use Trackzio services you must be at least 13 years old or have parental consent.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Account Registration</h2>
          <p>Accounts may be created using:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Google Sign-In</li>
            <li>Apple Sign-In</li>
            <li>Email registration</li>
            <li>Guest accounts</li>
          </ul>
          <p>You are responsible for maintaining the confidentiality of your credentials.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Description of Services</h2>
          <p>Trackzio apps may include features such as:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI image identification</li>
            <li>Collection tracking</li>
            <li>Community features</li>
            <li>Marketplace listings</li>
            <li>AI chat assistants</li>
            <li>Habit tracking tools</li>
          </ul>
          <p>Information inside apps is provided for educational purposes and may not always be accurate.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Purchases and Subscriptions</h2>
          <p>Some features require payment through:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Apple App Store</li>
            <li>Google Play Store</li>
          </ul>
          <p>Subscriptions renew automatically unless cancelled.</p>
          <p>Refunds are handled by the respective app store.</p>

          <h2 className="text-lg font-bold text-foreground font-display">User Content</h2>
          <p>Users may upload photos, notes, collections, and posts.</p>
          <p>You retain ownership but grant Trackzio a license to use the content for operating services.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Prohibited Activities</h2>
          <p>Users may not:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Use the services illegally</li>
            <li>Upload harmful or offensive content</li>
            <li>Reverse engineer the apps</li>
            <li>Scrape databases</li>
            <li>Interfere with system security</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">Intellectual Property</h2>
          <p>All software, AI models, databases, and designs belong to Trackzio Mobile Application Private Limited.</p>
          <p>Users receive a limited license for personal use.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Third Party Services</h2>
          <p>Trackzio may rely on:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Cloud providers</li>
            <li>Analytics platforms</li>
            <li>AI processing services</li>
          </ul>
          <p>These providers operate under their own policies.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Service Availability</h2>
          <p>Trackzio may update or discontinue services without notice.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Disclaimer</h2>
          <p>Services are provided "as is". Trackzio does not guarantee accuracy of AI results.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Limitation of Liability</h2>
          <p>Trackzio is not liable for indirect damages or losses resulting from use of the services.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Governing Law</h2>
          <p>These Terms are governed by the laws of India.</p>
          <p>Disputes fall under the jurisdiction of courts in Bangalore, Karnataka, India.</p>

          <h2 className="text-lg font-bold text-foreground font-display">Contact</h2>
          <p>Trackzio Mobile Application Private Limited</p>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Website: <a href="https://trackzio.com" className="text-primary hover:underline">https://trackzio.com</a></p>
          <p>Location: India</p>
        </div>
      </div>
    </section>
  );
}
