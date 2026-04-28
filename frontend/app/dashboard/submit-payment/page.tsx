'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { ArrowLeft } from 'lucide-react';

export default function SubmitPaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    course_id: '',
    amount: '',
    reference: '',
    proof_image_url: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/payments', {
        ...form,
        amount: Number(form.amount),
      });
      router.push('/dashboard?tab=payments');
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Failed to submit payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-12">
      <div className="max-w-xl mx-auto">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-10 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <span className="text-brand-blue text-xs tracking-widest uppercase">Academy</span>
        <h1 className="font-bebas text-4xl text-white mt-2 mb-8">SUBMIT PAYMENT</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/50 text-sm block mb-2">Course ID</label>
            <input
              type="text"
              required
              placeholder="Enter the course ID provided to you"
              value={form.course_id}
              onChange={e => setForm({ ...form, course_id: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-2">Amount Paid (₦)</label>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-2">Transaction Reference</label>
            <input
              type="text"
              required
              placeholder="Bank/crypto transaction reference"
              value={form.reference}
              onChange={e => setForm({ ...form, reference: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          <div>
            <label className="text-white/50 text-sm block mb-2">Proof Image URL (Optional)</label>
            <input
              type="url"
              placeholder="Link to screenshot of payment"
              value={form.proof_image_url}
              onChange={e => setForm({ ...form, proof_image_url: e.target.value })}
              className="w-full bg-white/5 border border-white/10 text-white px-4 py-3 focus:outline-none focus:border-brand-blue transition"
            />
          </div>
          {error && (
            <p className="text-red-400 text-sm border border-red-400/20 bg-red-400/10 px-4 py-3">
              {error}
            </p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-600 transition disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </form>
      </div>
    </div>
  );
}