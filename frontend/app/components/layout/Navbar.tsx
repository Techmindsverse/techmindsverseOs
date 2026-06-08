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
  const isDark = theme === 'dark';

  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [companyOpen,  setCompanyOpen]  = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setPlatformOpen(false);
    setCompanyOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const navBg = scrolled
    ? isDark
      ? 'bg-black/95 border-b border-white/5'
      : 'bg-white/98 border-b border-gray-200 shadow-sm'
    : 'bg-transparent';

  const linkColor = isDark
    ? 'text-white/70 hover:text-white'
    : 'text-gray-600 hover:text-gray-900';

  const logoText = isDark ? 'text-white' : 'text-gray-900';

  const dropdownBg   = isDark ? 'bg-black border-white/10' : 'bg-white border-gray-200 shadow-lg';
  const dropdownItem = isDark
    ? 'text-white/70 hover:text-white hover:bg-white/5'
    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50';

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img
              src="/logo.png"
              alt="TechMindsVerse"
              className="w-9 h-9 rounded-md transition-transform duration-300 group-hover:scale-105"
            />
            <span className={`font-bebas text-lg tracking-widest hidden sm:block transition-colors ${logoText} group-hover:text-[#1A3BDB]`}>
              TECHMINDSVERSE
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${linkColor}`}>
                Platform
                <ChevronDown size={13} className={`transition-transform ${platformOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {platformOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 mt-2 w-52 border p-2 z-50 ${dropdownBg}`}
                  >
                    {PLATFORM.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2.5 transition-colors rounded-sm
                          ${pathname === link.href ? 'text-[#1A3BDB]' : dropdownItem}`}
                      >
                        <p className="text-sm font-medium">{link.label}</p>
                        <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{link.desc}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div
              className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className={`flex items-center gap-1 text-sm font-medium transition-colors ${linkColor}`}>
                Company
                <ChevronDown size={13} className={`transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute top-full left-0 mt-2 w-44 border p-2 z-50 ${dropdownBg}`}
                  >
                    {COMPANY.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={`block px-3 py-2 text-sm transition-colors rounded-sm
                          ${pathname === link.href ? 'text-[#1A3BDB]' : dropdownItem}`}
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
                href={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/dashboard'}
                className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2 hover:bg-blue-700 transition-all"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-medium transition-colors ${isDark ? 'text-white/60 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-[#1A3BDB] text-white text-sm font-semibold px-5 py-2 hover:bg-blue-700 transition-all"
                >
                  Join Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile: theme toggle + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle />
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className={`w-9 h-9 flex items-center justify-center transition-colors ${isDark ? 'text-white' : 'text-gray-700'}`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className={`fixed inset-0 z-40 lg:hidden flex flex-col ${isDark ? 'bg-black' : 'bg-white'}`}
          >
            {/* Header */}
            <div className={`h-16 px-4 flex items-center justify-between border-b flex-shrink-0 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              <Link href="/" onClick={() => setMenuOpen(false)} className="flex items-center gap-2.5">
                <img src="/logo.png" alt="TechMindsVerse" className="w-8 h-8 rounded-md" />
                <span className={`font-bebas text-lg tracking-widest ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  TECHMINDSVERSE
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <ThemeToggle />
                <button
                  onClick={() => setMenuOpen(false)}
                  className={`w-9 h-9 flex items-center justify-center ${isDark ? 'text-white' : 'text-gray-700'}`}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
              <p className={`text-xs font-semibold uppercase tracking-widest px-2 mb-2 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
                Platform
              </p>
              {PLATFORM.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-between p-3.5 border rounded-xl transition-all
                      ${pathname === link.href
                        ? isDark
                          ? 'border-[#1A3BDB]/30 bg-[#1A3BDB]/8 text-[#1A3BDB]'
                          : 'border-blue-200 bg-blue-50 text-[#1A3BDB]'
                        : isDark
                          ? 'border-white/5 hover:border-white/12'
                          : 'border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                      }`}
                  >
                    <div>
                      <p className={`font-bebas text-lg leading-none ${
                        pathname === link.href ? 'text-[#1A3BDB]' : isDark ? 'text-white' : 'text-gray-800'
                      }`}>
                        {link.label.toUpperCase()}
                      </p>
                      <p className={`text-xs mt-0.5 ${isDark ? 'text-white/30' : 'text-gray-400'}`}>{link.desc}</p>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 opacity-30" />
                  </Link>
                </motion.div>
              ))}

              <div className="pt-4">
                <p className={`text-xs font-semibold uppercase tracking-widest px-2 mb-2 ${isDark ? 'text-white/25' : 'text-gray-400'}`}>
                  Company
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {COMPANY.map(link => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      className={`p-3 text-sm border rounded-lg transition-all
                        ${pathname === link.href
                          ? 'text-[#1A3BDB] border-blue-200 bg-blue-50'
                          : isDark
                            ? 'text-white/50 border-white/5 hover:border-white/12 hover:text-white'
                            : 'text-gray-500 border-gray-100 hover:border-gray-200 hover:text-gray-800'
                        }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer CTAs */}
            <div className={`px-4 py-4 border-t space-y-2 flex-shrink-0 ${isDark ? 'border-white/5' : 'border-gray-100'}`}>
              {isHydrated && user ? (
                <Link
                  href={user.role === 'admin' || user.role === 'super_admin' ? '/admin' : '/dashboard'}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center w-full bg-[#1A3BDB] text-white py-3.5 font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/register"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center justify-center w-full bg-[#1A3BDB] text-white py-3.5 font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all"
                  >
                    Join Ecosystem — Free
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center justify-center w-full py-3.5 text-sm font-medium border rounded-xl transition-all
                      ${isDark
                        ? 'border-white/10 text-white/60 hover:text-white hover:border-white/25'
                        : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
                      }`}
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}