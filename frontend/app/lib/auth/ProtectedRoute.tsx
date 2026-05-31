'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/app/lib/store/auth.store';
import { UserRole, ModuleName, getDashboardRoute } from '@/app/lib/auth/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: UserRole[];
  requiredModule?: ModuleName;
  fallback?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  requiredRoles,
  requiredModule,
  fallback,
}: ProtectedRouteProps) {
  const router = useRouter();
  const { user, hasRole, hasModule } = useAuthStore();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    if (!token) {
      router.push('/login');
      return;
    }

    if (requiredRoles && !hasRole(requiredRoles)) {
      const dashboard = getDashboardRoute(user?.role || 'member');
      router.push(dashboard);
      return;
    }

    if (requiredModule && !hasModule(requiredModule)) {
      router.push('/dashboard?access=denied');
      return;
    }

    setChecking(false);
  }, [user]);

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A3BDB] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}