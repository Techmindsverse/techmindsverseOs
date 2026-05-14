import PublicLayout from '@/app/components/layout/PublicLayout';
import { CheckCircle, XCircle } from 'lucide-react';

const allowed = [
  'Respectful and constructive communication',
  'Sharing knowledge and helping fellow students',
  'Submitting original work for projects',
  'Providing honest feedback',
  'Reporting issues through proper channels',
  'Collaborative learning and growth',
];

const notAllowed = [
  'Harassment, bullying, or disrespectful behavior',
  'Plagiarism or submitting others work as your own',
  'Sharing account credentials with others',
  'Spamming or promotional content without permission',
  'Payment fraud or misrepresentation',
  'Attempting to bypass platform security',
];

export default function CommunityGuidelinesPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Community</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-4">COMMUNITY GUIDELINES</h1>
          <p className="text-white/40 mb-12 leading-relaxed">
            TechMindsVerse is a community of builders, learners, and creators.
            These guidelines ensure a safe, productive, and respectful environment for everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="border border-green-500/20 p-6">
              <h2 className="font-bebas text-2xl text-green-400 mb-4">WHAT WE ENCOURAGE</h2>
              <div className="space-y-3">
                {allowed.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-white/60 text-sm">
                    <CheckCircle size={14} className="text-green-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="border border-red-500/20 p-6">
              <h2 className="font-bebas text-2xl text-red-400 mb-4">WHAT IS NOT ALLOWED</h2>
              <div className="space-y-3">
                {notAllowed.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-white/60 text-sm">
                    <XCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8 text-white/60 leading-relaxed">
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">ENFORCEMENT</h2>
              <p>Violations of these guidelines may result in warnings, temporary suspension, or permanent removal from the platform depending on severity. We review all reports seriously.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">REPORTING</h2>
              <p>If you experience or witness a violation of these guidelines, please report it through the complaints system in your dashboard or email us at techmindsverse@gmail.com.</p>
            </div>
            <div>
              <h2 className="font-bebas text-2xl text-white mb-3">ACADEMY RULES</h2>
              <p>Students are expected to attend classes, submit projects on time, and engage actively with the learning process. Academic dishonesty will result in immediate removal from the program.</p>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}