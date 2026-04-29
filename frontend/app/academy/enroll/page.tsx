'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import api from '@/app/lib/api';

export default function EnrollPage() {
  const params = useSearchParams();
  const router = useRouter();

  const course = params.get('course');

  const [amount, setAmount] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) {
      router.push('/login');
    }
  }, []);

  const handleSubmit = async () => {
    if (!amount || !reference) {
      alert('Fill all fields');
      return;
    }

    setLoading(true);

    try {
      await api.post('/payments', {
        amount,
        reference,
        course,
      });

      alert('Payment submitted. Await admin approval.');
      router.push('/dashboard');

    } catch (err) {
      alert('Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 py-20">
      <div className="max-w-xl mx-auto">

        <h1 className="text-3xl font-bold mb-4">Enroll</h1>

        <p className="text-white/40 mb-6">
          Course: <span className="text-white">{course}</span>
        </p>

        {/* PAYMENT INFO */}
        <div className="border border-white/10 p-4 mb-6 text-sm text-white/60">
          <p>Pay to:</p>
          <p className="mt-2">USDT Wallet: YOUR_WALLET_ADDRESS</p>
          <p>Bank Transfer: (Add later)</p>
        </div>

        {/* FORM */}
        <div className="space-y-4">

          <input
            type="number"
            placeholder="Amount Paid"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-black border border-white/10 px-4 py-3"
          />

          <input
            type="text"
            placeholder="Transaction Reference"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            className="w-full bg-black border border-white/10 px-4 py-3"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-brand-blue py-3 font-semibold"
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>

        </div>
      </div>
    </div>
  );
}