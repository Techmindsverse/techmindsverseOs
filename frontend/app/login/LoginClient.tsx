'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || null;
  const { setAuth, isHydrated } = useAuthStore();

  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/auth/login', form);
      const { access_token, user, role } = res.data;

      const authUser = {
        ...user,
        role: role || user.role,
        roles: user.roles || [role || user.role],
      };

      // Set auth state — this writes to localStorage AND cookies
      setAuth(authUser, access_token);

      // MOBILE FIX: Use a small delay to let cookies be written
      // before the router navigates and middleware reads them
      await new Promise((resolve) => setTimeout(resolve, 80));

      const destination =
        redirect ||
        (authUser.role === 'admin' || authUser.role === 'super_admin'
          ? '/admin'
          : '/dashboard');

      // Use replace to prevent back-button loop to login
      router.replace(destination);
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.message)
          ? err.response.data.message[0]
          : null) ||
        'Invalid email or password';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition';

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(26,59,219,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(26,59,219,1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-blue/8 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-brand-blue rounded-sm flex items-center justify-center">
              <span className="font-bebas text-white text-lg">T</span>
            </div>
            <span className="font-bebas text-xl tracking-widest text-white">
              TECHMINDSVERSE
            </span>
          </Link>
          <h1 className="font-bebas text-4xl text-white">SIGN IN</h1>
          <p className="text-white/40 text-sm mt-1">
            Access your TechMindsVerse OS account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-white/50 text-xs block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="you@example.com"
              autoComplete="email"
              className={inputClass}
            />
          </div>

          <div>
            <label className="text-white/50 text-xs block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Enter your password"
                autoComplete="current-password"
                className={`${inputClass} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-white/30 text-xs hover:text-brand-blue transition"
            >
              Forgot password?
            </Link>
          </div>

          {error && (
            <div className="border border-red-400/20 bg-red-400/10 text-red-400 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-2">
          <p className="text-white/30 text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-brand-blue hover:underline">
              Create Account
            </Link>
          </p>
          <p className="text-white/20 text-xs">
            Enrolling in Academy?{' '}
            <Link href="/register" className="text-brand-blue hover:underline">
              Apply here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}