import PublicLayout from '@/app/components/layout/PublicLayout';

export default function CookiePolicyPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Legal</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-12">COOKIE POLICY</h1>
          <p className="text-white/30 text-sm mb-8">Last updated: May 2026</p>

          <div className="space-y-10 text-white/60 leading-relaxed">
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">1. WHAT ARE COOKIES</h2>
              <p>Cookies are small text files stored on your device when you visit our website. They help us provide a better experience by remembering your preferences and session information.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">2. COOKIES WE USE</h2>
              <p>Essential cookies: Required for the platform to function, including authentication tokens that keep you logged in. These cannot be disabled.</p>
              <p className="mt-2">Analytics cookies: Help us understand how visitors use our platform so we can improve it. These are optional.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">3. MANAGING COOKIES</h2>
              <p>You can control and delete cookies through your browser settings. Note that disabling essential cookies will prevent you from logging into your account.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">4. THIRD PARTY COOKIES</h2>
              <p>We may use third-party services such as analytics providers that set their own cookies. These are governed by the respective third-party privacy policies.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">5. CONTACT</h2>
              <p>Questions about our cookie policy can be sent to techmindsverse@gmail.com.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}