'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/store/api';

export default function ActivatePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [validating, setValidating] = useState(true);
  const [valid, setValid] = useState(false);
  const [maskedEmail, setMaskedEmail] = useState('');
  const [form, setForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      setValidating(false);
      return;
    }
    api.get(`/auth/activate?token=${token}`)
      .then(res => {
        setValid(true);
        setMaskedEmail(res.data.email);
      })
      .catch(() => setValid(false))
      .finally(() => setValidating(false));
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      setError('Passwords do not match');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/activate', { token, password: form.password });
      router.push('/login?activated=true');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Activation failed');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white/40">Validating token...</p>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="text-center">
          <h2 className="font-bebas text-4xl text-white mb-4">INVALID OR EXPIRED LINK</h2>
          <p className="text-white/40 mb-8">This activation link is invalid or has expired.</p>
          <Link href="/contact" className="text-brand-blue hover:underline text-sm">
            Contact support
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-10 h-10 bg-brand-blue rounded-sm flex items-center justify-center mx-auto mb-6">
            <span className="font-bebas text-white text-xl">T</span>
          </div>
          <h1 className="font-bebas text-4xl text-white">ACTIVATE ACCOUNT</h1>
          <p className="text-white/40 text-sm mt-2">
            Setting up account for <span className="text-white/60">{maskedEmail}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/50 text-sm block mb-2">New Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 rounded focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-2">Confirm Password</label>
            <input
              type="password"
              required
              value={form.confirm}
              onChange={e => setForm({ ...form, confirm: e.target.value })}
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
            {loading ? 'Activating...' : 'Activate Account'}
          </button>
        </form>
      </div>
    </div>
  );
}