import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function RockzyTerms() {
  usePageAnalytics('rockzy-terms', 'page_view_rockzy_terms');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Rockzy: AI Rock Identifier — Terms of Service</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 2 February 2026</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Agreement to Terms</h2>
          <p>By using Rockzy: AI Rock Identifier ("Rockzy"), you agree to be bound by these Terms of Service. If you do not agree, do not use the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Eligibility</h2>
          <p>You must be at least 13 years old to use Rockzy. If you are under 18, you must have parental or guardian consent.</p>

          <h2 className="text-lg font-bold text-foreground font-display">3. App Services</h2>
          <p>Rockzy provides:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>AI-powered rock/mineral identification (via our backend model)</li>
            <li>Collection and history features</li>
            <li>AI Chat for rock/mineral questions</li>
            <li>A public community to share posts and interact with other users</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">4. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Any activity under your account (including guest usage tied to an anonymous ID)</li>
            <li>Keeping your login credentials confidential if you create an account</li>
            <li>Using Rockzy lawfully and respectfully, including within the community</li>
          </ul>

          <h2 className="text-lg font-bold text-foreground font-display">5. Community Rules</h2>
          <p>Because Rockzy includes a public community, you agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Post illegal, harmful, abusive, or infringing content</li>
            <li>Harass others, impersonate anyone, or spam</li>
            <li>Upload content you do not have the rights to share</li>
          </ul>
          <p>We may remove content or restrict access to maintain community safety.</p>

          <h2 className="text-lg font-bold text-foreground font-display">6. Intellectual Property</h2>
          <p>All branding, app design, and features of Rockzy are owned by Trackzio Mobile Application Private Limited and protected by applicable intellectual property laws.</p>

          <h2 className="text-lg font-bold text-foreground font-display">7. User-Generated Content</h2>
          <p>You retain ownership of content you upload (images, posts, notes). You grant us a license to use this content only to operate, maintain, and improve the service (including improving identification features), and to display community posts within the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. Accuracy of Information</h2>
          <p>Identification results and AI Chat responses are estimates and may be incorrect. Rockzy is for informational and educational purposes only. You should independently verify any critical information.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Termination</h2>
          <p>We may suspend or terminate accounts, or limit access (including community access), if you violate these Terms or misuse the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. Modifications</h2>
          <p>We may update the app or these Terms at any time. Continued use after changes means you accept the updated Terms.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. In-App Purchases</h2>
          <p>Some features may require payment. Prices and features may change and will be shown at the time of purchase.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. No Refund Policy</h2>
          <p>All purchases are final and non-refundable, except where refunds are required by law or platform policies.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Disclaimers</h2>
          <p>Rockzy is provided "as is." We do not guarantee uninterrupted availability, accuracy, or uptime. Use is at your own risk.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Limitation of Liability</h2>
          <p>To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages arising from your use of Rockzy.</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes will be subject to the jurisdiction of the Gujarat High Court, India.</p>

          <h2 className="text-lg font-bold text-foreground font-display">16. Contact</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company: Trackzio Mobile Application Private Limited</p>
          <p>Address: Gujarat, India</p>
        </div>
      </div>
    </section>
  );
}
