import PublicLayout from '@/app/components/layout/PublicLayout';

export default function PrivacyPolicyPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Legal</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-12">PRIVACY POLICY</h1>
          <p className="text-white/30 text-sm mb-8">Last updated: May 2026</p>

          <div className="space-y-10 text-white/60 leading-relaxed">
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">1. INFORMATION WE COLLECT</h2>
              <p>We collect information you provide directly to us, such as your name, email address, phone number, and payment details when you enroll in our academy, submit a build request, or contact us.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">2. HOW WE USE YOUR INFORMATION</h2>
              <p>We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and respond to your comments and questions.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">3. DATA STORAGE</h2>
              <p>Your data is stored securely using Supabase (PostgreSQL). We use industry-standard encryption and security practices to protect your personal information.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">4. DATA SHARING</h2>
              <p>We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our platform.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">5. COOKIES</h2>
              <p>We use cookies to maintain your session and improve your experience. You can control cookie settings through your browser preferences.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">6. YOUR RIGHTS</h2>
              <p>You have the right to access, update, or delete your personal information. Contact us at techmindsverse@gmail.com to exercise these rights.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">7. CONTACT US</h2>
              <p>If you have questions about this Privacy Policy, please contact us at techmindsverse@gmail.com.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}