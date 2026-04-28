'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/app/lib/api';

export default function ActivatePage() {
  const params = useSearchParams();
  const token = params.get('token');

  useEffect(() => {
    if (token) {
      api.post('/auth/activate', { token })
        .then(() => alert('Account activated'))
        .catch(() => alert('Invalid or expired token'));
    }
  }, [token]);

  return <p>Activating account...</p>;
}