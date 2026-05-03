'use client';

import { useState } from 'react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/api';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, ArrowLeft, CheckCircle, Globe, Smartphone, Cpu, ShoppingBag, Zap, Palette, HelpCircle } from 'lucide-react';

const categories = [
  { label: 'Website', icon: Globe, desc: 'Landing pages, portfolios, business sites' },
  { label: 'App', icon: Smartphone, desc: 'Web apps, dashboards, SaaS platforms' },
  { label: 'Fintech', icon: Cpu, desc: 'Payment systems, crypto, financial tools' },
  { label: 'E-commerce', icon: ShoppingBag, desc: 'Online stores and marketplaces' },
  { label: 'Automation', icon: Zap, desc: 'Workflows, bots, and system integration' },
  { label: 'Branding', icon: Palette, desc: 'Logo, identity, and digital presence' },
  { label: 'Other', icon: HelpCircle, desc: 'Something else entirely' },
];

const budgetRanges = [
  'Under $500',
  '$500 - $1,500',
  '$1,500 - $5,000',
  '$5,000 - $15,000',
  '$15,000+',
  'Not sure yet',
];

const TOTAL_STEPS = 5;

export default function BuildPage() {
  const [mode, setMode] = useState<'structured' | 'custom' | null>(null);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    name: '',
    email: '',
    description: '',
    category: '',
    budget: '',
    requirements: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const next = () => setStep(s => s + 1);
  const prev = () => setStep(s => s - 1);

  const progress = Math.round((step / TOTAL_STEPS) * 100);

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setError('Name and email are required.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/build', { ...form, mode });
      setSuccess(true);
    } catch {
      setError('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="min-h-screen py-32 px-6">
        <div className="max-w-3xl mx-auto">

          {/* Header */}
          <div className="text-center mb-16">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase">Build Studio</span>
            <h1 className="font-bebas text-6xl md:text-8xl text-white mt-2 leading-none">
              BUILD YOUR PRODUCT
            </h1>
            <p className="text-white/40 mt-4 max-w-lg mx-auto leading-relaxed">
              Turn your idea into a real digital product. We handle design, development, and delivery.
            </p>
          </div>

          {/* Success */}
          {success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-green-500/30 bg-green-500/5 p-12 text-center"
            >
              <CheckCircle size={48} className="text-green-400 mx-auto mb-6" />
              <h2 className="font-bebas text-4xl text-white mb-3">REQUEST RECEIVED</h2>
              <p className="text-white/40 leading-relaxed mb-8 max-w-md mx-auto">
                Your build request has been submitted. Our team will review it and contact you within 24–48 hours with next steps.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="border border-white/10 text-white px-6 py-3 text-sm hover:border-white/30 transition">
                  Back to Home
                </Link>
                <Link href="/contact" className="bg-brand-blue text-white px-6 py-3 text-sm hover:bg-blue-600 transition">
                  Contact Us Directly
                </Link>
              </div>
            </motion.div>
          ) : (
            <>
              {/* Progress bar — only show after step 0 */}
              {step > 0 && (
                <div className="mb-10">
                  <div className="flex justify-between text-xs text-white/30 mb-2">
                    <span>Step {step} of {TOTAL_STEPS}</span>
                    <span>{progress}% complete</span>
                  </div>
                  <div className="w-full bg-white/5 h-1">
                    <motion.div
                      className="h-1 bg-brand-blue"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.4 }}
                    />
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">

                {/* STEP 0 — START */}
                {step === 0 && (
                  <motion.div
                    key="start"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6 text-center"
                  >
                    <h2 className="font-bebas text-3xl text-white">Where are you right now?</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={next}
                        className="p-8 border border-white/10 bg-white/[0.02] hover:border-brand-blue hover:bg-brand-blue/5 transition text-left group"
                      >
                        <div className="font-bebas text-2xl text-white mb-2 group-hover:text-brand-blue transition">
                          I HAVE AN IDEA
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          I know what I want to build and I am ready to start the process.
                        </p>
                      </button>
                      <Link
                        href="/contact"
                        className="p-8 border border-white/10 bg-white/[0.02] hover:border-white/30 transition text-left group block"
                      >
                        <div className="font-bebas text-2xl text-white mb-2">NOT SURE YET</div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          I need guidance and consultation before committing to a project.
                        </p>
                      </Link>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1 — MODE */}
                {step === 1 && (
                  <motion.div
                    key="mode"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="font-bebas text-3xl text-white text-center">What type of build?</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                      <button
                        onClick={() => { setMode('structured'); next(); }}
                        className={`p-8 border text-left transition group ${
                          mode === 'structured'
                            ? 'border-brand-blue bg-brand-blue/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-brand-blue hover:bg-brand-blue/5'
                        }`}
                      >
                        <div className="font-bebas text-2xl text-white mb-2 group-hover:text-brand-blue transition">
                          STRUCTURED BUILD
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          Predefined service packages. Faster delivery, clear scope, transparent pricing.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {['Website', 'App', 'Branding'].map(t => (
                            <span key={t} className="text-xs border border-white/10 text-white/30 px-2 py-0.5">{t}</span>
                          ))}
                        </div>
                      </button>
                      <button
                        onClick={() => { setMode('custom'); next(); }}
                        className={`p-8 border text-left transition group ${
                          mode === 'custom'
                            ? 'border-purple-500 bg-purple-500/10'
                            : 'border-white/10 bg-white/[0.02] hover:border-purple-500 hover:bg-purple-500/5'
                        }`}
                      >
                        <div className="font-bebas text-2xl text-white mb-2">CUSTOM BUILD</div>
                        <p className="text-white/40 text-sm leading-relaxed">
                          Fully tailored to your idea. We scope, plan, and build from scratch.
                        </p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {['Fintech', 'SaaS', 'Complex Systems'].map(t => (
                            <span key={t} className="text-xs border border-white/10 text-white/30 px-2 py-0.5">{t}</span>
                          ))}
                        </div>
                      </button>
                    </div>
                    <button onClick={prev} className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition">
                      <ArrowLeft size={14} /> Back
                    </button>
                  </motion.div>
                )}

                {/* STEP 2 — CATEGORY */}
                {step === 2 && (
                  <motion.div
                    key="category"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <h2 className="font-bebas text-3xl text-white text-center">What are you building?</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {categories.map(c => (
                        <button
                          key={c.label}
                          onClick={() => { setForm({ ...form, category: c.label }); next(); }}
                          className={`p-5 border text-left transition group ${
                            form.category === c.label
                              ? 'border-brand-blue bg-brand-blue/10'
                              : 'border-white/10 bg-white/[0.02] hover:border-brand-blue hover:bg-brand-blue/5'
                          }`}
                        >
                          <c.icon size={20} className="text-brand-blue mb-3" />
                          <div className="font-medium text-white text-sm">{c.label}</div>
                          <div className="text-white/30 text-xs mt-1 leading-relaxed">{c.desc}</div>
                        </button>
                      ))}
                    </div>
                    <button onClick={prev} className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition">
                      <ArrowLeft size={14} /> Back
                    </button>
                  </motion.div>
                )}

                {/* STEP 3 — DESCRIPTION */}
                {step === 3 && (
                  <motion.div
                    key="description"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-bebas text-3xl text-white text-center mb-2">Describe your idea</h2>
                      <p className="text-white/30 text-sm text-center">
                        Be as detailed as possible. The more we know, the better we can help.
                      </p>
                    </div>
                    <div>
                      <label className="text-white/50 text-sm block mb-2">Project Description *</label>
                      <textarea
                        required
                        rows={5}
                        value={form.description}
                        onChange={e => setForm({ ...form, description: e.target.value })}
                        placeholder="Describe what you want to build, who it's for, and what problem it solves..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none"
                      />
                    </div>
                    <div>
                      <label className="text-white/50 text-sm block mb-2">Budget Range</label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {budgetRanges.map(b => (
                          <button
                            key={b}
                            type="button"
                            onClick={() => setForm({ ...form, budget: b })}
                            className={`px-3 py-2 border text-sm transition ${
                              form.budget === b
                                ? 'border-brand-blue text-brand-blue bg-brand-blue/10'
                                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-white/50 text-sm block mb-2">Additional Requirements (Optional)</label>
                      <textarea
                        rows={3}
                        value={form.requirements}
                        onChange={e => setForm({ ...form, requirements: e.target.value })}
                        placeholder="Any specific features, integrations, timeline, or technical requirements..."
                        className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition resize-none"
                      />
                    </div>
                    <div className="flex justify-between">
                      <button onClick={prev} className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition">
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        onClick={() => { if (!form.description) { setError('Please describe your project.'); return; } setError(''); next(); }}
                        className="flex items-center gap-2 text-brand-blue hover:gap-3 transition text-sm"
                      >
                        Continue <ArrowRight size={14} />
                      </button>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                  </motion.div>
                )}

                {/* STEP 4 — CONTACT */}
                {step === 4 && (
                  <motion.div
                    key="contact"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-6"
                  >
                    <div>
                      <h2 className="font-bebas text-3xl text-white text-center mb-2">Your contact details</h2>
                      <p className="text-white/30 text-sm text-center">We will reach out to discuss your project.</p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-5">
                      <div>
                        <label className="text-white/50 text-sm block mb-2">Full Name *</label>
                        <input
                          type="text"
                          required
                          value={form.name}
                          onChange={e => setForm({ ...form, name: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                        />
                      </div>
                      <div>
                        <label className="text-white/50 text-sm block mb-2">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
                        />
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="border border-white/5 p-6 space-y-3">
                      <h3 className="font-bebas text-lg text-white mb-4">REQUEST SUMMARY</h3>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/30">Build Type</span>
                        <span className="text-white capitalize">{mode || '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/30">Category</span>
                        <span className="text-white">{form.category || '—'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-white/30">Budget</span>
                        <span className="text-white">{form.budget || 'Not specified'}</span>
                      </div>
                    </div>

                    {error && (
                      <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3">
                        {error}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <button onClick={prev} className="flex items-center gap-2 text-white/30 hover:text-white text-sm transition">
                        <ArrowLeft size={14} /> Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="flex items-center gap-2 bg-brand-blue text-white px-8 py-3 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                      >
                        {loading ? 'Submitting...' : 'Submit Request'}
                        {!loading && <ArrowRight size={16} />}
                      </button>
                    </div>

                    <p className="text-center text-white/20 text-xs">
                      No payment required. We will contact you to discuss scope and pricing.
                    </p>
                  </motion.div>
                )}

              </AnimatePresence>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}