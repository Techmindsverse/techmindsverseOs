'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/app/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
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
          <h1 className="font-bebas text-4xl text-white">FORGOT PASSWORD</h1>
          <p className="text-white/40 text-sm mt-2">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        {sent ? (
          <div className="border border-green-500/30 bg-green-500/10 text-green-400 p-6 text-center rounded">
            <p className="font-medium mb-2">Check your email</p>
            <p className="text-sm text-green-400/70">
              If this email exists in our system, a reset link has been sent.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/50 text-sm block mb-2">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
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
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <p className="text-center text-white/30 text-sm mt-8">
          Remember your password?{' '}
          <Link href="/login" className="text-brand-blue hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}