'use client';

import { useAuthStore } from '@/app/lib/store/auth.store';
import { UserRole } from '@/app/lib/auth/permissions';

interface RoleGateProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGate({ roles, children, fallback }: RoleGateProps) {
  const { hasRole } = useAuthStore();
  if (hasRole(roles)) return <>{children}</>;
  return fallback ? <>{fallback}</> : null;
}