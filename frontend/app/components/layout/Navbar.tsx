'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { ThemeToggle, useTheme } from '@/app/components/ThemeProvider';
import { useAuthStore } from '@/app/lib/store/auth.store';

const PLATFORM = [
  { label: 'Academy',      href: '/academy',   desc: 'Learn by building' },
  { label: 'Build Studio', href: '/build',     desc: 'Build your product' },
  { label: 'Services',     href: '/services',  desc: 'Hire our team' },
  { label: 'Products',     href: '/products',  desc: 'What we built' },
  { label: 'Community',    href: '/community', desc: 'Join the ecosystem' },
];

const COMPANY = [
  { label: 'About',   href: '/about' },
  { label: 'Team',    href: '/team' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'FAQ',     href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { user, isHydrated } = useAuthStore();
  const [scrolled, setScrolled]       = useState(false);
  const [menuOpen, setMenuOpen]       = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [companyOpen, setCompanyOpen]   = useState(false);

  const isDark = theme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close everything on route change
  useEffect(() => {
    setMenuOpen(false);
    setPlatformOpen(false);
    setCompanyOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navBg = scrolled
    ? isDark
      ? 'bg-black/95 border-b border-white/5'
      : 'bg-white/95 border-b border-gray-100 shadow-sm'
    : 'bg-transparent';

  const textColor = isDark ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900';
  const logoText  = isDark ? 'text-white' : 'text-gray-900';

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-[#1A3BDB] rounded-sm flex items-center justify-center">
              <span className="font-bebas text-white text-base">T</span>
            </div>
            <span className={`font-bebas text-lg tracking-widest hidden sm:block ${logoText}`}>
              TECHMINDSVERSE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">

            {/* Platform dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm transition-colors ${textColor}`}>
                Platform
                <ChevronDown
                  size={13}
                  className={`transition-transform ${platformOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {platformOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 mt-2 w-52 p-2 z-50
                      ${isDark
                        ? 'bg-black border border-white/10'
                        : 'bg-white border border-gray-100 shadow-lg'
                      }`}
                  >
                    {PLATFORM.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2.5 transition-colors rounded-sm
                          ${pathname === link.href
                            ? 'text-[#1A3BDB]'
                            : isDark
                              ? 'text-white/70 hover:text-white hover:bg-white/5'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                      >
                        <p className="text-sm font-medium">{link.label}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{link.desc}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm transition-colors ${textColor}`}>
                Company
                <ChevronDown
                  size={13}
                  className={`transition-transform ${companyOpen ? 'rotate-180' : ''}`}
                />
              </button>
              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 mt-2 w-44 p-2 z-50
                      ${isDark
                        ? 'bg-black border border-white/10'
                        : 'bg-white border border-gray-100 shadow-lg'
                      }`}
                  >
                    {COMPANY.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 text-sm transition-colors rounded-sm
                          ${pathname === link.href
                            ? 'text-[#1A3BDB]'
                            : isDark
                              ? 'text-white/70 hover:text-white hover:bg-white/5'
                              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                          }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            {isHydrated && user ? (
              <Link
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2.5 hover:bg-blue-700 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2.5 hover:bg-blue-700 transition-all"
                >
                  Join Ecosystem
                </Link>
              </>
            )}
          </div>

          {/* Mobile right side: theme toggle + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Theme toggle VISIBLE on mobile */}
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 flex items-center justify-center transition-colors
                ${isDark ? 'text-white' : 'text-gray-700'}`}
              aria-label="Menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={`fixed inset-0 z-40 lg:hidden ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            {/* Header */}
            <div className={`h-16 px-4 flex items-center justify-between border-b
              ${isDark ? 'border-white/5' : 'border-gray-100'}`}
            >
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#1A3BDB] rounded-sm flex items-center justify-center">
                  <span className="font-bebas text-white text-base">T</span>
                </div>
                <span className={`font-bebas text-lg tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  TECHMINDSVERSE
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMenuOpen(false)}
                  className={`w-9 h-9 flex items-center justify-center
                    ${isDark ? 'text-white' : 'text-gray-700'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="overflow-y-auto h-[calc(100vh-4rem)] px-4 py-6 space-y-2">

              <p className={`text-xs uppercase tracking-widest px-2 mb-3 font-semibold
                ${isDark ? 'text-white/20' : 'text-gray-400'}`}
              >
                Platform
              </p>
              {PLATFORM.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-4 border transition-colors
                      ${pathname === link.href
                        ? isDark
                          ? 'border-[#1A3BDB]/30 bg-[#1A3BDB]/8 text-[#1A3BDB]'
                          : 'border-blue-200 bg-blue-50 text-[#1A3BDB]'
                        : isDark
                          ? 'border-white/5 text-white/70 hover:border-white/10'
                          : 'border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <div>
                      <p className="font-bebas text-lg tracking-widest">{link.label.toUpperCase()}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{link.desc}</p>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 opacity-40" />
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4">
                <p className={`text-xs uppercase tracking-widest px-2 mb-3 font-semibold
                  ${isDark ? 'text-white/20' : 'text-gray-400'}`}
                >
                  Company
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {COMPANY.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`p-3 text-sm border transition-colors
                        ${pathname === link.href
                          ? 'text-[#1A3BDB] border-blue-200'
                          : isDark
                            ? 'text-white/50 border-white/5 hover:border-white/10 hover:text-white'
                            : 'text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-900'
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* CTA buttons */}
              <div className={`pt-6 mt-4 border-t space-y-3
                ${isDark ? 'border-white/5' : 'border-gray-100'}`}
              >
                {isHydrated && user ? (
                  <Link
                    href={user.role === 'admin' ? '/admin' : '/dashboard'}
                    onClick={() => setMenuOpen(false)}
                    className="block w-full text-center bg-[#1A3BDB] text-white py-4 font-semibold hover:bg-blue-700 transition-all text-sm"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      onClick={() => setMenuOpen(false)}
                      className="block w-full text-center bg-[#1A3BDB] text-white py-4 font-semibold hover:bg-blue-700 transition-all text-sm"
                    >
                      Join Ecosystem — Free
                    </Link>
                    <Link
                      href="/login"
                      onClick={() => setMenuOpen(false)}
                      className={`block w-full text-center py-4 text-sm font-medium border transition-all
                        ${isDark
                          ? 'border-white/10 text-white/60 hover:text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                        }`}
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}