'use client';

import { useAuthStore } from '@/app/lib/store/auth.store';
import { ModuleName } from '@/app/lib/auth/permissions';
import Link from 'next/link';
import { Lock } from 'lucide-react';

interface ModuleGateProps {
  module: ModuleName;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLock?: boolean;
}

export function ModuleGate({
  module,
  children,
  fallback,
  showLock = true,
}: ModuleGateProps) {
  const { hasModule } = useAuthStore();

  if (hasModule(module)) return <>{children}</>;

  if (fallback) return <>{fallback}</>;

  if (!showLock) return null;

  const moduleLabels: Record<ModuleName, string> = {
    academy: 'Academy',
    build_studio: 'Build Studio',
    community: 'Community',
    admin_panel: 'Admin Panel',
    marketplace: 'Marketplace',
    hiring: 'Hiring',
    ai_tools: 'AI Tools',
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
      <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-4">
        <Lock size={20} className="text-gray-400" />
      </div>
      <h3 className="text-gray-700 font-semibold mb-2">
        {moduleLabels[module]} Access Required
      </h3>
      <p className="text-gray-400 text-sm mb-5 max-w-xs mx-auto">
        You need access to the {moduleLabels[module]} module to view
        this content.
      </p>
      <Link
        href="/enroll"
        className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all inline-flex items-center gap-2"
      >
        Get Access
      </Link>
    </div>
  );
}