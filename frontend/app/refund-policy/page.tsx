import PublicLayout from '@/app/components/layout/PublicLayout';

export default function RefundPolicyPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Legal</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-12">REFUND POLICY</h1>
          <p className="text-white/30 text-sm mb-8">Last updated: May 2026</p>

          <div className="space-y-10 text-white/60 leading-relaxed">
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">1. ACADEMY FEES</h2>
              <p>Academy enrollment fees are non-refundable once your account has been activated and you have gained access to course materials. If your payment is approved but you have not yet activated your account, you may request a refund within 48 hours.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">2. BUILD STUDIO PROJECTS</h2>
              <p>Refund eligibility for build projects depends on the project stage. Refunds may be available if work has not yet commenced. Once development begins, partial refunds may be considered based on work completed.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">3. SERVICE PACKAGES</h2>
              <p>Service package refunds are handled on a case-by-case basis. If we are unable to deliver the agreed service, a full refund will be issued. Partial refunds are available for work partially completed.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">4. HOW TO REQUEST A REFUND</h2>
              <p>To request a refund, contact us at techmindsverse@gmail.com with your payment reference and reason for the refund request. We will review and respond within 5 business days.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">5. PROCESSING TIME</h2>
              <p>Approved refunds will be processed within 7-14 business days depending on your payment method.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}