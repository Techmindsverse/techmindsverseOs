'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { ArrowLeft, CheckCircle, BookOpen, Package, Activity, Bell } from 'lucide-react';

const courses = [
  'Full-Stack Development',
  'UI/UX & Product Design',
  'Graphic Design & Branding',
  'Video Editing & Videography',
  'Prompt Engineering & AI Tools',
];

const benefits = [
  'Access your personal student dashboard',
  'Track your learning journey and progress',
  'Submit projects and receive instructor feedback',
  'Access course materials and resources',
  'Connect with the TechMindsVerse community',
  'Unlock ecosystem features as you progress',
];

function EnrollForm() {
  const params = useSearchParams();
  const router = useRouter();
  const courseParam = params.get('course');

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    course: courseParam || '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    setIsLoggedIn(!!token);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course) { setError('Please select a course.'); return; }
    setLoading(true);
    setError('');
    try {
      await api.post('/contact/send', {
        name: form.name,
        email: form.email,
        subject: `Academy Enrollment: ${form.course}`,
        message: `Course Interest: ${form.course}\nPhone: ${form.phone}\n\n${form.message || 'No additional message.'}`,
      });
      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Already logged in — redirect to dashboard
  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-black text-white px-6 py-32">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-sm flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={28} className="text-green-400" />
          </div>
          <h1 className="font-bebas text-4xl text-white mb-3">YOU ARE ALREADY IN</h1>
          <p className="text-white/40 mb-8 leading-relaxed">
            Your TechMindsVerse account is active. Head to your dashboard to access academy materials, submit projects, and track your progress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-brand-blue text-white px-8 py-3 font-medium hover:bg-blue-600 transition"
            >
              Go to Dashboard
            </button>
            <Link
              href="/academy"
              className="border border-white/20 text-white px-8 py-3 font-medium hover:border-white/40 transition text-center"
            >
              Browse Courses
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-6xl mx-auto px-6 py-32">

        <Link href="/academy" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-12 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Academy
        </Link>

        <div className="grid lg:grid-cols-2 gap-16">

          {/* LEFT — Info */}
          <div>
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase">Join the Ecosystem</span>
            <h1 className="font-bebas text-6xl md:text-7xl text-white mt-2 leading-none mb-6">
              ENROLL IN
              <br />
              <span className="text-brand-blue">ACADEMY</span>
            </h1>
            <p className="text-white/40 leading-relaxed mb-10">
              Submit your enrollment interest and our team will contact you within 24 hours with payment details. Once payment is verified and your account is activated, you get full access to the ecosystem.
            </p>

            {/* Benefits */}
            <div className="space-y-3 mb-10">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex items-start gap-3">
                  <CheckCircle size={14} className="text-brand-blue shrink-0 mt-0.5" />
                  <span className="text-white/50 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            {/* Flow */}
            <div className="border border-white/5 p-6">
              <h3 className="font-bebas text-lg text-white mb-4">HOW IT WORKS</h3>
              <div className="space-y-3">
                {[
                  { step: '01', text: 'Submit enrollment interest below' },
                  { step: '02', text: 'Team contacts you with payment details' },
                  { step: '03', text: 'Make payment and upload proof' },
                  { step: '04', text: 'Admin verifies and approves' },
                  { step: '05', text: 'Activation email sent to you' },
                  { step: '06', text: 'Set password and access dashboard' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="font-bebas text-brand-blue/50 text-lg w-8 shrink-0">{item.step}</span>
                    <span className="text-white/40">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div>
            {success ? (
              <div className="border border-green-500/30 bg-green-500/5 p-10 text-center h-full flex flex-col items-center justify-center">
                <CheckCircle size={48} className="text-green-400 mx-auto mb-6" />
                <h2 className="font-bebas text-4xl text-white mb-3">APPLICATION RECEIVED</h2>
                <p className="text-white/40 leading-relaxed mb-8 max-w-sm">
                  Thank you for your interest in TechMindsVerse Academy. Our team will contact you within 24 hours with payment details and next steps.
                </p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <Link
                    href="/login"
                    className="bg-brand-blue text-white px-6 py-3 text-sm font-medium text-center hover:bg-blue-600 transition"
                  >
                    Already activated? Sign In
                  </Link>
                  <Link
                    href="/academy"
                    className="border border-white/10 text-white/60 px-6 py-3 text-sm text-center hover:border-white/30 transition"
                  >
                    Back to Academy
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border border-white/5 p-8">
                <h2 className="font-bebas text-2xl text-white mb-6">ENROLLMENT FORM</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-white/50 text-sm block mb-2">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition text-sm"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="text-white/50 text-sm block mb-2">Phone Number *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+234..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm block mb-2">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition text-sm"
                    />
                  </div>

                  <div>
                    <label className="text-white/50 text-sm block mb-2">Course of Interest *</label>
                    <select
                      required
                      value={form.course}
                      onChange={e => setForm({ ...form, course: e.target.value })}
                      className="w-full bg-black border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition text-sm"
                    >
                      <option value="" disabled className="bg-black">Select a course</option>
                      {courses.map(c => (
                        <option key={c} value={c} className="bg-black">{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-white/50 text-sm block mb-2">Why do you want to join? (Optional)</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={e => setForm({ ...form, message: e.target.value })}
                      placeholder="Tell us about your goals..."
                      className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none text-sm"
                    />
                  </div>

                  {error && (
                    <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-600 transition disabled:opacity-50 text-sm"
                  >
                    {loading ? 'Submitting...' : 'Submit Enrollment Interest'}
                  </button>

                  <p className="text-center text-white/20 text-xs">
                    No payment required at this stage. We will contact you with details.
                  </p>

                  <div className="border-t border-white/5 pt-4 text-center">
                    <p className="text-white/30 text-xs">
                      Already have an account?{' '}
                      <Link href="/login" className="text-brand-blue hover:underline">
                        Sign in here
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EnrollPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EnrollForm />
    </Suspense>
  );
}