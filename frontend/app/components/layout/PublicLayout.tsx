'use client';

import { useTheme } from '@/app/components/ThemeProvider';
import Navbar from './Navbar';
import Footer from './Footer';
import PWAInstall from '@/app/components/PWAInstall';
import MobileNav from '@/app/components/MobileNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-200 ${
        theme === 'dark' ? 'bg-black' : 'bg-[#f5f6fa]'
      }`}
    >
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <PWAInstall />
      <MobileNav />
    </div>
  );
}