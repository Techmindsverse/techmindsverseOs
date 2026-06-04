'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/app/lib/store/auth.store';

export default function AuthHydrator() {
  const { hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return null;
}