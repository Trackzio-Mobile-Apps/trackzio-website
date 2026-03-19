import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function BanknoteTerms() {
  usePageAnalytics('banknote-terms', 'page_view_banknote_terms');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Banknote Identification AI: Terms of Service</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last Updated: 14th May 2025</p>

          <h2 className="text-lg font-bold text-foreground font-display">1. Agreement to Terms</h2>
          <p>By using Banknote Identification AI, you agree to be bound by these Terms of Service. If you do not agree, please refrain from using the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">2. Eligibility</h2>
          <p>You must be at least 13 years old to use Banknote Identification AI. Users under 18 must have parental or guardian consent.</p>

          <h2 className="text-lg font-bold text-foreground font-display">3. App Services</h2>
          <p>Banknote Identification AI provides AI-powered banknote identification, collection management, and estimated valuations for collectible or historical banknotes.</p>

          <h2 className="text-lg font-bold text-foreground font-display">4. User Responsibilities</h2>
          <p>You are responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.</p>

          <h2 className="text-lg font-bold text-foreground font-display">5. Intellectual Property</h2>
          <p>All content, branding, and features of Banknote Identification AI are owned by Trackzio Mobile Application Private Limited and protected under intellectual property laws.</p>

          <h2 className="text-lg font-bold text-foreground font-display">6. User-Generated Content</h2>
          <p>You retain ownership of the content you upload, including images and banknote metadata. You grant us a license to use this content solely for service provision and enhancement.</p>

          <h2 className="text-lg font-bold text-foreground font-display">7. Accuracy of Information</h2>
          <p>AI results, valuations, and identifications are estimates and may not be entirely accurate. Users should independently verify any critical information.</p>

          <h2 className="text-lg font-bold text-foreground font-display">8. Termination</h2>
          <p>We reserve the right to suspend or terminate user accounts at our discretion for violating these terms or engaging in misuse.</p>

          <h2 className="text-lg font-bold text-foreground font-display">9. Modifications</h2>
          <p>We may update or modify the app or these terms at any time. Continued use of the app after changes implies acceptance.</p>

          <h2 className="text-lg font-bold text-foreground font-display">10. In-App Purchases</h2>
          <p>Some features of Banknote Identification AI may require payment. Prices and features are subject to change.</p>

          <h2 className="text-lg font-bold text-foreground font-display">11. No Refund Policy</h2>
          <p>All purchases are final and non-refundable, including in the event the app is shut down. Refunds are only issued where legally required.</p>

          <h2 className="text-lg font-bold text-foreground font-display">12. Disclaimers</h2>
          <p>We make no guarantees about the availability or uptime of the service. Use is at your own risk.</p>

          <h2 className="text-lg font-bold text-foreground font-display">13. Limitation of Liability</h2>
          <p>We are not liable for any indirect, incidental, or consequential damages arising from your use of the app.</p>

          <h2 className="text-lg font-bold text-foreground font-display">14. Governing Law</h2>
          <p>These Terms are governed by the laws of India. Any disputes will be resolved in the jurisdiction of Gujarat High Court, India.</p>

          <h2 className="text-lg font-bold text-foreground font-display">15. Contact</h2>
          <p>Email: <a href="mailto:developer@trackzio.com" className="text-primary hover:underline">developer@trackzio.com</a></p>
          <p>Company Name: Trackzio Mobile Application Private Limited</p>
          <p>Address: Gujarat, India</p>
        </div>
      </div>
    </section>
  );
}
