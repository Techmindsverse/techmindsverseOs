'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Package, User, Menu } from 'lucide-react';
import { clsx } from 'clsx';

const navItems = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/academy', icon: BookOpen, label: 'Academy' },
  { href: '/build', icon: Package, label: 'Build' },
  { href: '/dashboard', icon: User, label: 'Dashboard' },
  { href: '/community', icon: Menu, label: 'Community' },
];

export default function MobileNav() {
  const pathname = usePathname();
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/admin');
  if (isProtected) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black/95 backdrop-blur-md border-t border-white/5 lg:hidden">
      <div className="grid grid-cols-5 h-16">
        {navItems.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 transition-colors',
              pathname === item.href ? 'text-brand-blue' : 'text-white/30 hover:text-white'
            )}
          >
            <item.icon size={20} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}