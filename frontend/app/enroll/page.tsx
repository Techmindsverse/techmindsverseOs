'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/app/lib/api';
import { ArrowLeft } from 'lucide-react';

const courses = [
  'Full-Stack Development',
  'UI/UX & Product Design',
  'Graphic Design & Branding',
  'Video Editing & Videography',
  'Prompt Engineering & AI Tools',
];

export default function EnrollPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: 'Academy Enrollment Interest',
    message: '',
    course: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact/send', {
        name: form.name,
        email: form.email,
        subject: `Academy Enrollment: ${form.course}`,
        message: `Course Interest: ${form.course}\nPhone: ${form.phone}\n\n${form.message}`,
      });
      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/academy"
          className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Academy
        </Link>

        <span className="text-brand-blue text-xs tracking-widest uppercase">Join Us</span>
        <h1 className="font-bebas text-5xl text-white mt-2 mb-2">ENROLL IN ACADEMY</h1>
        <p className="text-white/40 text-sm mb-10 leading-relaxed">
          Fill in your details and we will contact you with payment information.
          Once payment is confirmed, your account will be activated.
        </p>

        {success ? (
          <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-8 text-center rounded">
            <h3 className="font-bebas text-2xl mb-3">APPLICATION RECEIVED</h3>
            <p className="text-sm text-green-400/70 leading-relaxed">
              Thank you for your interest. Our team will contact you within 24 hours
              with payment details and next steps.
            </p>
            <Link
              href="/login"
              className="inline-block mt-6 text-brand-blue text-sm hover:underline"
            >
              Already have an account? Sign in
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="text-white/50 text-sm block mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                />
              </div>
            </div>

            <div>
              <label className="text-white/50 text-sm block mb-2">Phone Number</label>
              <input
                type="tel"
                required
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+234..."
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
              />
            </div>

            <div>
              <label className="text-white/50 text-sm block mb-2">Course of Interest</label>
              <select
                required
                value={form.course}
                onChange={e => setForm({ ...form, course: e.target.value })}
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
              >
                <option value="" disabled className="bg-black">Select a course</option>
                {courses.map(c => (
                  <option key={c} value={c} className="bg-black">{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-white/50 text-sm block mb-2">
                Why do you want to join? (Optional)
              </label>
              <textarea
                rows={4}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Tell us about your goals and what you hope to achieve..."
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none"
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
              className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Enrollment Interest'}
            </button>

            <p className="text-center text-white/20 text-xs leading-relaxed">
              By submitting, you agree to be contacted by TechMindsVerse regarding
              your enrollment. No payment is required at this stage.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}