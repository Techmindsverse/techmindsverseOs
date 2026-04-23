'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { clsx } from 'clsx';

const navLinks = [
  { label: 'Academy', href: '/academy' },
  { label: 'Services', href: '/services' },
  { label: 'Products', href: '/products' },
  { label: 'Build', href: '/build' },
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={clsx(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-black/90 backdrop-blur-md border-b border-brand-border'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
           <img
    src="/logo.png"
    alt="TechMindsVerse Logo"
    className="w-12 h-12 relative z-10 rounded-md hover:scale-110 transition-transform duration-300"
  />
            <span className="font-bebas text-xl tracking-widest text-white group-hover:text-brand-blue transition-colors">
              TECHMINDSVERSE
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={clsx(
                  'text-sm font-medium tracking-wide transition-colors duration-200 relative group',
                  pathname === link.href
                    ? 'text-brand-blue'
                    : 'text-white/70 hover:text-white'
                )}
              >
                {link.label}
                <span className={clsx(
                  'absolute -bottom-1 left-0 h-px bg-brand-blue transition-all duration-300',
                  pathname === link.href ? 'w-full' : 'w-0 group-hover:w-full'
                )} />
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
            <Link
              href="/academy"
              className="px-4 py-2 bg-brand-blue text-white text-sm font-medium rounded hover:bg-blue-600 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
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
            className="fixed inset-0 z-40 bg-black pt-20 px-6 lg:hidden"
          >
            <div className="flex flex-col gap-6 pt-8">
              {navLinks.map((link, i) => (
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
                      'font-bebas text-4xl tracking-widest transition-colors',
                      pathname === link.href ? 'text-brand-blue' : 'text-white hover:text-brand-blue'
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="flex flex-col gap-3 mt-4">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="text-white/70 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  href="/academy"
                  onClick={() => setMenuOpen(false)}
                  className="px-6 py-3 bg-brand-blue text-white text-sm font-medium rounded text-center"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}