'use client';

import { useState } from 'react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/api';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['App', 'Website', 'Fintech', 'E-commerce', 'Automation', 'Branding', 'Other'];

export default function BuildPage() {
  const [mode, setMode] = useState<'structured' | 'custom' | null>(null);
  const [step, setStep] = useState(1);

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

  const next = () => setStep((s) => Math.min(s + 1, 3));
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      await api.post('/build', {
        ...form,
        mode,
      });

      setSuccess(true);
    } catch {
      setError('Failed to submit. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <section className="min-h-screen py-32 px-6">
        <div className="max-w-3xl mx-auto">

          {/* HEADER */}
          <div className="text-center mb-16">
            <span className="text-brand-blue text-xs tracking-widest uppercase">
              Build Studio
            </span>

            <h1 className="font-bebas text-6xl md:text-8xl text-white mt-2">
              BUILD YOUR PRODUCT
            </h1>

            <p className="text-white/40 mt-4">
              Turn ideas into real digital products — structured or fully custom.
            </p>
          </div>

          {/* SUCCESS STATE */}
          {success ? (
            <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6 rounded text-center">
              Build request submitted. We’ll contact you within 24–48 hours.
            </div>
          ) : (

            <AnimatePresence mode="wait">

              {/* STEP 1 — MODE SELECTION */}
              {step === 1 && (
                <motion.div
                  key="mode"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid md:grid-cols-2 gap-6"
                >

                  {/* STRUCTURED */}
                  <button
                    onClick={() => {
                      setMode('structured');
                      next();
                    }}
                    className="p-8 border border-white/10 bg-white/5 rounded hover:border-brand-blue transition text-left"
                  >
                    <h3 className="text-white font-semibold text-xl">
                      Structured Build
                    </h3>
                    <p className="text-white/40 text-sm mt-2">
                      Choose from predefined service packages with clear pricing and execution flow.
                    </p>

                    <div className="mt-4 text-xs text-brand-blue">
                      Recommended for startups & businesses
                    </div>
                  </button>

                  {/* CUSTOM */}
                  <button
                    onClick={() => {
                      setMode('custom');
                      next();
                    }}
                    className="p-8 border border-white/10 bg-white/5 rounded hover:border-purple-500 transition text-left"
                  >
                    <h3 className="text-white font-semibold text-xl">
                      Custom Build
                    </h3>
                    <p className="text-white/40 text-sm mt-2">
                      Bring your idea — we define scope, design, and build it with you.
                    </p>

                    <div className="mt-4 text-xs text-purple-400">
                      For founders, creators & unique ideas
                    </div>
                  </button>

                </motion.div>
              )}

              {/* STEP 2 — STRUCTURED FLOW */}
              {step === 2 && mode === 'structured' && (
                <motion.div
                  key="structured"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setForm({ ...form, category: c });
                        next();
                      }}
                      className="p-6 border border-white/10 rounded bg-white/5 hover:border-brand-blue hover:bg-brand-blue/10 transition text-white"
                    >
                      {c}
                    </button>
                  ))}

                  <div className="col-span-2 flex justify-between mt-4">
                    <button onClick={prev} className="text-white/50">
                      Back
                    </button>
                  </div>
                </motion.div>
              )}

              {/* STEP 2 — CUSTOM FLOW */}
              {step === 2 && mode === 'custom' && (
                <motion.div
                  key="custom"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >

                  <textarea
                    placeholder="Describe your idea in detail..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  <textarea
                    placeholder="What problem are you solving?"
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  <textarea
                    placeholder="Any reference apps or competitors?"
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  <div className="flex justify-between">
                    <button onClick={prev} className="text-white/50">
                      Back
                    </button>
                    <button onClick={next} className="text-brand-blue">
                      Next →
                    </button>
                  </div>

                </motion.div>
              )}

              {/* STEP 3 — CONTACT */}
              {step === 3 && (
                <motion.div
                  key="final"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >

                  <input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  <input
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  <input
                    placeholder="Budget (USDT / NGN / PayPal)"
                    value={form.budget}
                    onChange={(e) =>
                      setForm({ ...form, budget: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 text-white p-4 rounded"
                  />

                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}

                  <div className="flex justify-between">
                    <button onClick={prev} className="text-white/50">
                      Back
                    </button>

                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className="bg-brand-blue px-6 py-3 rounded text-white"
                    >
                      {loading ? 'Submitting...' : 'Submit Request'}
                    </button>
                  </div>

                </motion.div>
              )}

            </AnimatePresence>
          )}

        </div>
      </section>
    </PublicLayout>
  );
}