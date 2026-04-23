'use client';

import { useState } from 'react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/store/api';

const categories = ['App', 'Website', 'Fintech', 'E-commerce', 'Automation', 'Branding', 'Other'];

export default function BuildPage() {
  const [form, setForm] = useState({
    name: '', email: '', description: '',
    category: '', budget: '', requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/build', form);
      setSuccess(true);
      setForm({ name: '', email: '', description: '', category: '', budget: '', requirements: '' });
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-2xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Start a Project</span>
          <h1 className="font-bebas text-6xl md:text-8xl text-white mt-2 mb-4">BUILD YOUR PRODUCT</h1>
          <p className="text-white/40 mb-12">Tell us about your idea and we will turn it into a real digital product.</p>

          {success ? (
            <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6 rounded">
              Build request submitted. Our team will review and get back to you within 24–48 hours.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-white/50 text-sm block mb-2">Your Name</label>
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
                <label className="text-white/50 text-sm block mb-2">Project Category</label>
                <select
                  required
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(c => (
                    <option key={c} value={c} className="bg-black">{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Project Description</label>
                <textarea
                  required
                  rows={4}
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe your idea, goals, and what you want to achieve..."
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition resize-none"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Budget Range (Optional)</label>
                <input
                  type="text"
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  placeholder="e.g. $500 - $2000"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
                />
              </div>
              <div>
                <label className="text-white/50 text-sm block mb-2">Additional Requirements (Optional)</label>
                <textarea
                  rows={3}
                  value={form.requirements}
                  onChange={e => setForm({ ...form, requirements: e.target.value })}
                  placeholder="Any specific features, integrations, or timelines..."
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition resize-none"
                />
              </div>
              {error && <p className="text-red-400 text-sm">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white py-4 font-semibold rounded hover:bg-blue-600 transition disabled:opacity-50"
              >
                {loading ? 'Submitting...' : 'Submit Build Request'}
              </button>
            </form>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}