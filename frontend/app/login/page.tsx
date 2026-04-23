'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/store/api';
import { useAuthStore } from '@/app/lib/store/auth.store';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const { access_token, user } = res.data;
      setAuth(user, access_token);
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-brand-blue rounded-sm flex items-center justify-center">
              <span className="font-bebas text-white text-lg">T</span>
            </div>
            <span className="font-bebas text-xl tracking-widest text-white">TECHMINDSVERSE</span>
          </Link>
          <h1 className="font-bebas text-4xl text-white">WELCOME BACK</h1>
          <p className="text-white/40 text-sm mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
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
          <div>
            <label className="text-white/50 text-sm block mb-2">Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3 rounded">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-4 font-semibold rounded hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-8">
          No account?{' '}
          <Link href="/academy" className="text-brand-blue hover:underline">
            Enroll in Academy
          </Link>
        </p>
      </div>
    </div>
  );
}