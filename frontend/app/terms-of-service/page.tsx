import PublicLayout from '@/app/components/layout/PublicLayout';

export default function TermsOfServicePage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Legal</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-12">TERMS OF SERVICE</h1>
          <p className="text-white/30 text-sm mb-8">Last updated: May 2026</p>

          <div className="space-y-10 text-white/60 leading-relaxed">
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">1. ACCEPTANCE OF TERMS</h2>
              <p>By accessing and using TechMindsVerse, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our platform.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">2. USE OF SERVICES</h2>
              <p>You agree to use our services only for lawful purposes. You must not use our platform in any way that violates applicable laws or regulations, or that is harmful to other users.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">3. ACADEMY ENROLLMENT</h2>
              <p>Academy enrollment requires payment verification and admin approval. Access to course materials is granted only after successful account activation. Course fees are non-refundable after access is granted.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">4. BUILD STUDIO</h2>
              <p>Build requests are subject to review and acceptance. We reserve the right to decline any project. Pricing is agreed upon before work begins. Payment terms will be specified in individual project agreements.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">5. INTELLECTUAL PROPERTY</h2>
              <p>All content on TechMindsVerse is the property of TechMindsVerse or its content suppliers. Student projects remain the property of the respective students.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">6. ACCOUNT SECURITY</h2>
              <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized use of your account.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">7. TERMINATION</h2>
              <p>We reserve the right to suspend or terminate accounts that violate these terms. Users may also terminate their accounts by contacting us.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">8. CONTACT</h2>
              <p>Questions about these Terms should be sent to techmindsverse@gmail.com.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}