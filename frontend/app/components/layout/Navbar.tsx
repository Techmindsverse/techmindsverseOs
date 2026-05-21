'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';
import { ThemeToggle } from '@/app/components/ThemeProvider';
const platformLinks = [
  { label: 'Academy', href: '/academy', desc: 'Learn real skills' },
  { label: 'Build Studio', href: '/build', desc: 'Build your product' },
  { label: 'Services', href: '/services', desc: 'Hire our team' },
  { label: 'Products', href: '/products', desc: 'What we built' },
];

const companyLinks = [
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Roadmap', href: '/roadmap' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [platformOpen, setPlatformOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setPlatformOpen(false);
    setCompanyOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-black/90 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <img
              src="/logo.png"
              alt="TechMindsVerse"
              className="w-10 h-10 rounded-md hover:scale-110 transition-transform duration-300"
            />
            <span className="font-bebas text-xl tracking-widest text-white group-hover:text-brand-blue transition-colors hidden sm:block">
              TECHMINDSVERSE
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-6">

            {/* Platform Dropdown */}
            <div className="relative"
              onMouseEnter={() => setPlatformOpen(true)}
              onMouseLeave={() => setPlatformOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                Platform <ChevronDown size={13} className={clsx('transition-transform', platformOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {platformOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-black border border-white/10 p-2"
                  >
                    {platformLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={clsx(
                          'block px-4 py-3 hover:bg-white/5 transition-colors',
                          pathname === link.href && 'text-brand-blue'
                        )}
                      >
                        <p className="text-sm text-white font-medium">{link.label}</p>
                        <p className="text-xs text-white/30 mt-0.5">{link.desc}</p>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Company Dropdown */}
            <div className="relative"
              onMouseEnter={() => setCompanyOpen(true)}
              onMouseLeave={() => setCompanyOpen(false)}
            >
              <button className="flex items-center gap-1 text-sm text-white/70 hover:text-white transition-colors">
                Company <ChevronDown size={13} className={clsx('transition-transform', companyOpen && 'rotate-180')} />
              </button>
              <AnimatePresence>
                {companyOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-44 bg-black border border-white/10 p-2"
                  >
                    {companyLinks.map(link => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className={clsx(
                          'block px-4 py-2.5 text-sm hover:bg-white/5 transition-colors',
                          pathname === link.href ? 'text-brand-blue' : 'text-white/70 hover:text-white'
                        )}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/login"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              
              Sign In
            </Link>
            <Link
              href="/enroll"
              className="px-4 py-2 bg-brand-blue text-white text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Join Ecosystem
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black pt-20 px-6 overflow-y-auto lg:hidden"
          >
            <div className="pt-6 space-y-2">
              <p className="text-white/20 text-xs uppercase tracking-widest px-2 mb-3">Platform</p>
              {platformLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      'flex items-center justify-between p-4 border border-white/5 hover:border-brand-blue/30 transition-colors',
                      pathname === link.href && 'border-brand-blue/30 bg-brand-blue/5'
                    )}
                  >
                    <div>
                      <p className={clsx('font-bebas text-xl tracking-widest', pathname === link.href ? 'text-brand-blue' : 'text-white')}>
                        {link.label}
                      </p>
                      <p className="text-white/30 text-xs mt-0.5">{link.desc}</p>
                    </div>
                  </Link>
                </motion.div>
              ))}

              <p className="text-white/20 text-xs uppercase tracking-widest px-2 mb-3 mt-6">Company</p>
              {companyLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (platformLinks.length + i) * 0.05 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={clsx(
                      'block p-3 text-sm transition-colors',
                      pathname === link.href ? 'text-brand-blue' : 'text-white/60 hover:text-white'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <div className="flex flex-col gap-3 mt-8 pt-6 border-t border-white/5">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-center border border-white/10 text-white py-3 text-sm font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/enroll"
                  onClick={() => setMenuOpen(false)}
                  className="text-center bg-brand-blue text-white py-3 text-sm font-medium"
                >
                  Join Ecosystem
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}