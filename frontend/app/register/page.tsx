'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [form, setForm] = useState({ fullName: '', email: '', password: '' });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', form);
      setStep('verify');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/verify-otp', { email: form.email, otp });
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(26,59,219,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26,59,219,0.5) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-blue/5 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-blue rounded-sm flex items-center justify-center">
              <span className="font-bebas text-white text-lg">T</span>
            </div>
            <span className="font-bebas text-xl tracking-widest text-white">TECHMINDSVERSE</span>
          </Link>

          {step === 'register' ? (
            <>
              <h1 className="font-bebas text-4xl text-white">JOIN THE ECOSYSTEM</h1>
              <p className="text-white/40 text-sm mt-2">Create your TechMindsVerse account</p>
            </>
          ) : (
            <>
              <h1 className="font-bebas text-4xl text-white">VERIFY EMAIL</h1>
              <p className="text-white/40 text-sm mt-2">
                We sent a 6-digit code to <span className="text-white/60">{form.email}</span>
              </p>
            </>
          )}
        </div>

        {step === 'register' ? (
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="text-white/50 text-sm block mb-2">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={e => setForm({ ...form, fullName: e.target.value })}
                placeholder="Shedrack Nliam"
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
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
              />
            </div>
            <div>
              <label className="text-white/50 text-sm block mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimum 6 characters"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 pr-12 focus:outline-none focus:border-brand-blue transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Creating account...' : (<>Create Account <ArrowRight size={16} /></>)}
            </button>
            <p className="text-white/20 text-xs text-center">
              By creating an account, you agree to our{' '}
              <Link href="/terms-of-service" className="text-brand-blue hover:underline">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerify} className="space-y-5">
            <div>
              <label className="text-white/50 text-sm block mb-2">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength={6}
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="000000"
                className="w-full bg-white/5 border border-white/10 text-white px-4 py-4 text-center text-3xl tracking-[0.5em] font-bebas focus:outline-none focus:border-brand-blue transition"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Verifying...' : (<>Verify & Enter Ecosystem <ArrowRight size={16} /></>)}
            </button>
            <button
              type="button"
              onClick={() => { setStep('register'); setError(''); setOtp(''); }}
              className="w-full text-white/30 hover:text-white text-sm transition"
            >
              ← Change email
            </button>
          </form>
        )}

        <p className="text-center text-white/30 text-sm mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-blue hover:underline">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}