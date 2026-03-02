import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Privacy() {
  usePageAnalytics('privacy', 'page_view_privacy');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Privacy Policy</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last updated: February 2026</p>
          <p>At Trackzio, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our applications and website.</p>
          <h2 className="text-lg font-bold text-foreground font-display">1. Information We Collect</h2>
          <p>We may collect information that you provide directly to us, such as when you create an account, contact us, or use our applications. This may include your name, email address, and usage data.</p>
          <h2 className="text-lg font-bold text-foreground font-display">2. How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.</p>
          <h2 className="text-lg font-bold text-foreground font-display">3. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>
          <h2 className="text-lg font-bold text-foreground font-display">4. Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us at <a href="mailto:ayushya@trackzio.com" className="text-primary hover:underline">ayushya@trackzio.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
