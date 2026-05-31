'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/app/lib/api';
import { ArrowLeft, Upload } from 'lucide-react';

const input = 'w-full bg-white/5 border border-white/10 text-white px-4 py-3 text-sm focus:outline-none focus:border-brand-blue transition';

export default function SubmitPaymentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    amount: '',
    reference: '',
    proof_image_url: '',
    note: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/payments', {
        amount: Number(form.amount),
        reference: form.reference,
        proof_image_url: form.proof_image_url || undefined,
        course_id: undefined,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || 'Failed to submit payment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-sm flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-400">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="font-bebas text-3xl text-white mb-3">PAYMENT SUBMITTED</h2>
          <p className="text-white/40 text-sm mb-8">
            Your payment proof has been submitted. Our admin will review and approve within 24 hours.
            You'll receive an email notification once approved.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="bg-brand-blue text-white py-3 text-sm font-medium hover:bg-blue-700 transition text-center">
              Back to Dashboard
            </Link>
            <button onClick={() => setSuccess(false)} className="border border-white/10 text-white/50 hover:text-white py-3 text-sm transition">
              Submit Another
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-4 sm:px-6 py-12">
      <div className="max-w-lg mx-auto">
        <Link href="/dashboard" className="flex items-center gap-2 text-white/30 hover:text-white text-sm mb-10 transition-colors w-fit">
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>

        <span className="text-brand-blue text-xs tracking-widest uppercase">Payment</span>
        <h1 className="font-bebas text-3xl md:text-4xl text-white mt-2 mb-2">SUBMIT PAYMENT PROOF</h1>
        <p className="text-white/30 text-sm mb-8 leading-relaxed">
          Made a payment for your enrollment? Submit your proof here.
          Our admin verifies payments within 24 hours.
        </p>

        <div className="border border-brand-blue/20 bg-brand-blue/5 p-4 mb-8 text-sm">
          <p className="text-brand-blue font-medium mb-1">Payment Details</p>
          <p className="text-white/40 text-xs leading-relaxed">
            Send payment to the account details provided by our team.
            If you haven't received payment details, contact us at techmindsverse@gmail.com or via WhatsApp.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-white/50 text-xs block mb-1.5">Amount Paid (₦) *</label>
            <input
              type="number"
              required
              placeholder="e.g. 50000"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
              className={input}
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1.5">Transaction Reference *</label>
            <input
              type="text"
              required
              placeholder="Bank or crypto transaction reference/ID"
              value={form.reference}
              onChange={e => setForm({ ...form, reference: e.target.value })}
              className={input}
            />
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1.5">Screenshot URL (Optional)</label>
            <input
              type="url"
              placeholder="Link to screenshot of payment receipt"
              value={form.proof_image_url}
              onChange={e => setForm({ ...form, proof_image_url: e.target.value })}
              className={input}
            />
            <p className="text-white/20 text-xs mt-1">
              Upload screenshot to ImgBB or similar, paste the link here.
            </p>
          </div>
          <div>
            <label className="text-white/50 text-xs block mb-1.5">Additional Note (Optional)</label>
            <textarea
              rows={3}
              placeholder="Any additional information..."
              value={form.note}
              onChange={e => setForm({ ...form, note: e.target.value })}
              className={`${input} resize-none`}
            />
          </div>
          {error && (
            <div className="border border-red-400/20 bg-red-400/10 text-red-400 px-4 py-3 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-blue text-white py-4 font-semibold hover:bg-blue-700 transition disabled:opacity-50 text-sm"
          >
            {loading ? 'Submitting...' : 'Submit Payment Proof'}
          </button>
        </form>
      </div>
    </div>
  );
}