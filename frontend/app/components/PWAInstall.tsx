'use client';

import { useEffect, useState } from 'react';
import { Download, Link, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('pwa_dismissed');
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setTimeout(() => setShow(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setInstalled(true);
    setShow(false);
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('pwa_dismissed', 'true');
  };

  if (installed || !show) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50"
        >
          <div className="bg-black border border-brand-blue/30 p-5 shadow-2xl shadow-brand-blue/10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                 {/* Logo */}
          
            <img
              src="/logo.png"
              alt="TechMindsVerse"
              className="w-10 h-10 rounded-md hover:scale-110 transition-transform duration-300"
            />
            
                <div>
                  <p className="text-white font-semibold text-sm">Install TechMindsVerse OS</p>
                  <p className="text-white/40 text-xs">Use as an app on your device</p>
                </div>
              </div>
              <button onClick={handleDismiss} className="text-white/30 hover:text-white transition shrink-0">
                <X size={16} />
              </button>
            </div>
            <div className="space-y-1 mb-4">
              {['Works offline', 'Faster loading', 'Home screen access'].map((f, i) => (
                <p key={i} className="text-white/30 text-xs flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-brand-blue shrink-0" />{f}
                </p>
              ))}
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleInstall}
                className="flex-1 bg-brand-blue text-white py-2.5 text-sm font-medium hover:bg-blue-600 transition flex items-center justify-center gap-2"
              >
                <Download size={14} /> Install App
              </button>
              <button
                onClick={handleDismiss}
                className="px-4 border border-white/10 text-white/40 hover:text-white text-sm transition"
              >
                Later
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}