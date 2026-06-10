'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Package, User, Users } from 'lucide-react';
import { useTheme } from '@/app/components/ThemeProvider';

const navItems = [
  { href: '/',          icon: Home,     label: 'Home' },
  { href: '/academy',   icon: BookOpen, label: 'Academy' },
  { href: '/build',     icon: Package,  label: 'Build' },
  { href: '/dashboard', icon: User,     label: 'Dashboard' },
  { href: '/community', icon: Users,    label: 'Community' },
];

export default function MobileNav() {
  const pathname  = usePathname();
  const { theme } = useTheme();
  const isDark    = theme === 'dark';

  // Hide on dashboard/admin — those pages have their own mobile navigation
  if (pathname.startsWith('/dashboard') || pathname.startsWith('/admin')) return null;

  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 lg:hidden
      ${isDark
        ? 'bg-black/95 border-t border-white/8'
        : 'bg-white border-t border-gray-100 shadow-lg'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="grid grid-cols-5 h-16">
        {navItems.map(item => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 transition-colors relative
                ${active
                  ? 'text-[#1A3BDB]'
                  : isDark
                    ? 'text-white/30 hover:text-white/60'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
            >
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#1A3BDB] rounded-full" />
              )}
              <item.icon size={19} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}