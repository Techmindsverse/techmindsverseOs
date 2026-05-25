'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import {
  Eye, EyeOff, ArrowRight, User, Mail,
  Lock, Phone, AtSign, Upload, GraduationCap, Briefcase
} from 'lucide-react';

function generateUsername(fullName: string): string {
  return fullName
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '')
    .slice(0, 20) + '_' + Math.floor(Math.random() * 999);
}

export default function RegisterPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [role, setRole] = useState<'student' | 'client'>('student');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    avatar_url: '',
  });
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleNameChange = (name: string) => {
    setForm(f => ({
      ...f,
      fullName: name,
      username: f.username || generateUsername(name),
    }));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setAvatarPreview(result);
      setForm(f => ({ ...f, avatar_url: result }));
    };
    reader.readAsDataURL(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/register', { ...form, role });
      setStep('verify');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
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
      setError(err?.response?.data?.message || 'Invalid verification code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-12 relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `linear-gradient(rgba(26,59,219,0.8) 1px, transparent 1px),
          linear-gradient(90deg, rgba(26,59,219,0.8) 1px, transparent 1px)`,
        backgroundSize: '40px 40px',
      }} />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand-blue/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-9 h-9 bg-brand-blue rounded-sm flex items-center justify-center">
              <span className="font-bebas text-white text-xl">T</span>
            </div>
            <span className="font-bebas text-xl tracking-widest">TECHMINDSVERSE</span>
          </Link>
          <h1 className="font-bebas text-4xl text-white">
            {step === 'register' ? 'JOIN THE ECOSYSTEM' : 'VERIFY YOUR EMAIL'}
          </h1>
          <p className="text-white/40 text-sm mt-1">
            {step === 'register'
              ? 'Create your account and start building'
              : `Enter the 6-digit code sent to ${form.email}`}
          </p>
        </div>

        <AnimatePresence mode="wait">

          {/* STEP 1 — REGISTER */}
          {step === 'register' && (
            <motion.form
              key="register"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleRegister}
              className="space-y-4"
            >

              {/* Role selector */}
              <div className="grid grid-cols-2 gap-3 mb-2">
                {([
                  { value: 'student', icon: GraduationCap, label: 'Student', desc: 'I want to learn & build skills' },
                  { value: 'client', icon: Briefcase, label: 'Client', desc: 'I want to build a product' },
                ] as const).map(r => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`p-4 border text-left transition-all ${
                      role === r.value
                        ? 'border-brand-blue bg-brand-blue/10 text-white'
                        : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white/70'
                    }`}
                  >
                    <r.icon size={18} className={role === r.value ? 'text-brand-blue mb-2' : 'mb-2 opacity-40'} />
                    <p className="font-semibold text-sm">{r.label}</p>
                    <p className="text-xs mt-0.5 opacity-60">{r.desc}</p>
                  </button>
                ))}
              </div>

              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-16 h-16 border border-white/10 hover:border-brand-blue/30 transition-colors flex items-center justify-center shrink-0 relative overflow-hidden"
                >
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={16} className="text-white/30" />
                  )}
                </button>
                <div className="flex-1">
                  <p className="text-white/50 text-sm">Profile photo</p>
                  <p className="text-white/20 text-xs">Optional — JPG, PNG under 2MB</p>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-white/50 text-xs block mb-1.5">Full Name *</label>
                <div className="relative">
                  <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    value={form.fullName}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Shedrack Nliam"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="text-white/50 text-xs block mb-1.5">Username *</label>
                <div className="relative">
                  <AtSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="text"
                    required
                    value={form.username}
                    onChange={e => setForm(f => ({ ...f, username: e.target.value.toLowerCase().replace(/\s/g, '_') }))}
                    placeholder="shedrack_nliam"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
                <p className="text-white/20 text-xs mt-1">techmindsverse.com/u/{form.username || 'username'}</p>
              </div>

              {/* Email */}
              <div>
                <label className="text-white/50 text-xs block mb-1.5">Email Address *</label>
                <div className="relative">
                  <Mail size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="you@example.com"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="text-white/50 text-xs block mb-1.5">Phone Number</label>
                <div className="relative">
                  <Phone size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+234..."
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="text-white/50 text-xs block mb-1.5">Password *</label>
                <div className="relative">
                  <Lock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-white/5 border border-white/10 text-white pl-10 pr-12 py-3 text-sm focus:outline-none focus:border-brand-blue transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="border border-red-400/20 bg-red-400/10 text-red-400 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Creating account...' : (<>Create Account <ArrowRight size={16} /></>)}
              </button>

              <p className="text-white/20 text-xs text-center">
                By creating an account, you agree to our{' '}
                <Link href="/terms-of-service" className="text-brand-blue hover:underline">Terms</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="text-brand-blue hover:underline">Privacy Policy</Link>
              </p>

              <p className="text-center text-white/30 text-sm">
                Already have an account?{' '}
                <Link href="/login" className="text-brand-blue hover:underline">Sign in</Link>
              </p>
            </motion.form>
          )}

          {/* STEP 2 — OTP VERIFY */}
          {step === 'verify' && (
            <motion.form
              key="verify"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerify}
              className="space-y-5"
            >
              <div className="border border-white/5 bg-white/5 p-4 text-sm text-white/50 text-center">
                Code sent to <span className="text-white">{form.email}</span>
                <br />
                <span className="text-white/30 text-xs">Check spam folder if not received</span>
              </div>

              <div>
                <label className="text-white/50 text-xs block mb-2 text-center">Enter 6-digit code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-white/5 border border-white/10 text-white px-4 py-5 text-center text-4xl tracking-[0.6em] font-bebas focus:outline-none focus:border-brand-blue transition"
                />
              </div>

              {error && (
                <div className="border border-red-400/20 bg-red-400/10 text-red-400 px-4 py-3 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || otp.length !== 6}
                className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? 'Verifying...' : (<>Verify & Enter Ecosystem <ArrowRight size={16} /></>)}
              </button>

              <button
                type="button"
                onClick={() => { setStep('register'); setError(''); setOtp(''); }}
                className="w-full text-white/30 hover:text-white text-sm transition py-2"
              >
                ← Change details
              </button>
            </motion.form>
          )}

        </AnimatePresence>
      </motion.div>
    </div>
  );
}