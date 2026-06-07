'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { ArrowLeft, CheckCircle, Copy, Check } from 'lucide-react';

const inp = 'w-full tmv-input rounded-lg text-sm';

export default function SubmitPaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState({ amount: '', reference: '', proof_image_url: '', note: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyContact = () => {
    navigator.clipboard.writeText('techmindsverse@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await api.post('/payments', {
        amount: Number(form.amount),
        reference: form.reference,
        proof_image_url: form.proof_image_url || undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-root flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 status-success rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={32} />
          </div>
          <h2 className="font-bebas text-3xl text-primary mb-3">PAYMENT SUBMITTED</h2>
          <p className="text-secondary text-sm mb-8 leading-relaxed">
            Payment proof submitted. Admin will review and approve within 24 hours.
            You will receive an email notification once approved.
          </p>
          <div className="space-y-3">
            <Link href="/dashboard"
              className="block w-full bg-[#1A3BDB] text-white py-4 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-all"
            >Back to Dashboard</Link>
            <button onClick={() => setSuccess(false)}
              className="block w-full border border-surface text-secondary py-4 rounded-xl text-sm font-medium hover:border-[#1A3BDB] hover:text-[#1A3BDB] transition-all"
            >Submit Another</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-root px-4 sm:px-6 py-8">
      <div className="max-w-lg mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-secondary hover:text-primary text-sm mb-8 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <span className="text-[#1A3BDB] text-xs tracking-widest uppercase font-semibold">Payment</span>
        <h1 className="font-bebas text-3xl sm:text-4xl text-primary mt-1 mb-2">SUBMIT PAYMENT PROOF</h1>
        <p className="text-secondary text-sm mb-6 leading-relaxed">
          Made a payment for your enrollment? Submit your proof here for admin verification.
        </p>

        {/* Payment details card */}
        <div className="dash-card rounded-xl p-4 mb-6">
          <p className="text-[#1A3BDB] font-semibold text-sm mb-2">Haven't received payment details?</p>
          <p className="text-secondary text-xs leading-relaxed mb-3">
            Contact us and we'll send payment information within a few hours.
          </p>
          <button onClick={copyContact}
            className="flex items-center gap-2 text-xs font-medium text-[#1A3BDB] hover:underline"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'techmindsverse@gmail.com'}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-secondary text-xs font-medium block mb-1.5">Amount Paid (₦) *</label>
            <input type="number" required placeholder="e.g. 50000"
              value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })}
              className={inp} />
          </div>
          <div>
            <label className="text-secondary text-xs font-medium block mb-1.5">Transaction Reference *</label>
            <input type="text" required placeholder="Bank or crypto transaction ID"
              value={form.reference} onChange={e => setForm({ ...form, reference: e.target.value })}
              className={inp} />
          </div>
          <div>
            <label className="text-secondary text-xs font-medium block mb-1.5">
              Screenshot URL <span className="text-secondary/50 font-normal">(Optional)</span>
            </label>
            <input type="url" placeholder="https://imgbb.com/..."
              value={form.proof_image_url} onChange={e => setForm({ ...form, proof_image_url: e.target.value })}
              className={inp} />
            <p className="text-secondary text-xs mt-1.5">Upload to ImgBB or similar, paste link here.</p>
          </div>
          <div>
            <label className="text-secondary text-xs font-medium block mb-1.5">
              Note <span className="text-secondary/50 font-normal">(Optional)</span>
            </label>
            <textarea rows={3} placeholder="Any additional info..."
              value={form.note} onChange={e => setForm({ ...form, note: e.target.value })}
              className={`${inp} resize-none`} />
          </div>
          {error && (
            <div className="status-error rounded-xl px-4 py-3 text-sm">{error}</div>
          )}
          <button type="submit" disabled={loading}
            className="w-full bg-[#1A3BDB] text-white py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </span>
            ) : 'Submit Payment Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}