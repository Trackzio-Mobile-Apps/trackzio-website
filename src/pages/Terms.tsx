import { usePageAnalytics } from '@/hooks/usePageAnalytics';

export default function Terms() {
  usePageAnalytics('terms', 'page_view_terms');

  return (
    <section className="section-padding">
      <div className="container-site max-w-3xl">
        <h1 className="text-4xl font-bold font-display mb-8">Terms of Use</h1>
        <div className="space-y-6 text-muted-foreground text-sm leading-relaxed">
          <p>Last updated: February 2026</p>
          <p>Welcome to Trackzio. By accessing or using our website and applications, you agree to be bound by these Terms of Use. Please read them carefully before using our services.</p>
          <h2 className="text-lg font-bold text-foreground font-display">1. Acceptance of Terms</h2>
          <p>By accessing and using Trackzio's services, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          <h2 className="text-lg font-bold text-foreground font-display">2. Use of Services</h2>
          <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You agree not to use our services in any way that violates any applicable local, state, national, or international law.</p>
          <h2 className="text-lg font-bold text-foreground font-display">3. Intellectual Property</h2>
          <p>The service and its original content, features, and functionality are and will remain the exclusive property of Trackzio and its licensors.</p>
          <h2 className="text-lg font-bold text-foreground font-display">4. Contact</h2>
          <p>If you have any questions about these Terms, please contact us at <a href="mailto:ayushya@trackzio.com" className="text-primary hover:underline">ayushya@trackzio.com</a>.</p>
        </div>
      </div>
    </section>
  );
}
