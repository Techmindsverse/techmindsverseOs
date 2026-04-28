'use client';

import { useState } from 'react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact/send', form);
      setSuccess(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setError('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Get In Touch</span>
          <h1 className="font-bebas text-6xl md:text-8xl text-white mt-2 mb-4">CONTACT US</h1>
          <p className="text-white/40 mb-12">Partnerships, inquiries, or just want to say hello.</p>

          {success ? (
            <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6 rounded">
              Message sent successfully. We will get back to you soon.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/50 text-sm block mb-2">Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
                <div>
                  <label className="text-white/50 text-sm block mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Subject</label>
                <input
                  type="text"
                  required
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Message</label>
                <textarea
                  required
                  rows={6}
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white py-4 font-semibold rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}