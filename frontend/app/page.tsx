'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Code2,
  Layers,
  Zap,
  Users,
  Package,
  BookOpen
} from 'lucide-react';

import PublicLayout from '@/app/components/layout/PublicLayout';

/* =========================
   COUNT HOOK (UNCHANGED)
========================= */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;

    let startTime: number;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  }, [target, duration, start]);

  return count;
}

/* =========================
   DATA (UNCHANGED)
========================= */

const stats = [
  { value: 6, suffix: '+', label: 'Ecosystem Modules' },
  { value: 10, suffix: '+', label: 'Builders & Contributors' },
  { value: 2, suffix: '+', label: 'Active Products' },
  { value: 100, suffix: '%', label: 'Execution Focused' },
];

const ecosystemCards = [
  {
    icon: BookOpen,
    title: 'Academy',
    description: 'Project-based learning where students build real-world products while learning.',
    href: '/academy',
    tag: 'LEARN',
  },
  {
    icon: Package,
    title: 'Build Studio',
    description: 'Turn ideas into production-ready digital products with structured execution.',
    href: '/build',
    tag: 'BUILD',
  },
  {
    icon: Users,
    title: 'Tech Community',
    description: 'A growing network of builders, designers, and founders collaborating globally.',
    href: 'https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH',
    tag: 'CONNECT',
  },
];

/* =========================
   STAT CARD
========================= */

function StatCard({ stat, index, start }: any) {
  const count = useCountUp(stat.value, 2000, start);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center hover:scale-[1.04] transition-transform duration-300"
    >
      <div className="font-bebas text-6xl text-brand-blue">
        {count}{stat.suffix}
      </div>
      <div className="text-white/50 text-sm mt-2 tracking-wide">
        {stat.label}
      </div>
    </motion.div>
  );
}

/* =========================
   HOME PAGE
========================= */

export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  /* ===== SCROLL DETECTION ===== */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setStatsVisible(true);
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  /* ===== ANTI-GRAVITY PARALLAX SYSTEM ===== */
  const { scrollY } = useScroll();

  const yBg = useTransform(scrollY, [0, 800], [0, -80]);     // background drift
  const yOrb1 = useTransform(scrollY, [0, 800], [0, -40]);   // mid layer
  const yOrb2 = useTransform(scrollY, [0, 800], [0, 60]);    // reverse layer
  const yText = useTransform(scrollY, [0, 800], [0, -25]);   // text lift
  const opacityHero = useTransform(scrollY, [0, 500], [1, 0.9]);

  return (
    <PublicLayout>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

        {/* BACKGROUND GRID (DRIFT) */}
        <motion.div
          style={{
            y: yBg,
            backgroundImage:
              `linear-gradient(rgba(26,59,219,0.25) 1px, transparent 1px),
               linear-gradient(90deg, rgba(26,59,219,0.25) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
          className="absolute inset-0 opacity-[0.04]"
        />

        {/* FLOATING ORBS (LAYERED DEPTH) */}
        <motion.div
          style={{ y: yOrb1 }}
          className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[140px] float-slow"
        />

        <motion.div
          style={{ y: yOrb2 }}
          className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[140px] float"
        />

        {/* CONTENT (FLOATING UI) */}
        <motion.div
          style={{ y: yText, opacity: opacityHero }}
          className="relative z-10 max-w-7xl mx-auto px-6 text-center"
        >

          {/* TAG */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="inline-block px-4 py-1.5 border border-brand-blue/40 rounded-full text-brand-blue text-xs tracking-[0.25em] uppercase mb-8 glow-pulse">
              TechMindsVerse OS — Phase 1
            </span>
          </motion.div>

          {/* TITLE */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-bebas leading-[0.9] tracking-wider text-[clamp(3.5rem,10vw,9rem)] mb-6"
          >
            <span className="block bg-gradient-to-r from-[#1A3BDB] via-[#8B5CF6] to-[#1A3BDB] bg-clip-text text-transparent">
              TURNING IDEAS
            </span>

            <span className="block text-white/90">
              INTO REAL
            </span>

            <span className="block text-brand-blue">
              DIGITAL PRODUCTS
            </span>
          </motion.h1>

          <p className="text-white/60 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            A unified execution ecosystem where people learn, build, and ship real digital systems — powered by structure, people, and intelligent automation.
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">

            <Link href="/academy"
              className="px-8 py-4 bg-brand-blue text-white font-semibold rounded flex items-center gap-2 hover:scale-[1.04] hover:shadow-lg hover:shadow-brand-blue/20 transition-all"
            >
              Explore Academy <ArrowRight size={16} />
            </Link>

            <Link href="/build"
              className="px-8 py-4 border border-white/20 text-white rounded hover:border-brand-blue hover:text-brand-blue transition hover:scale-[1.04]"
            >
              Build Your Product
            </Link>

            <a
              href="https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH"
              target="_blank"
              className="px-8 py-4 border border-green-500/30 text-green-400 rounded hover:bg-green-500/10 transition hover:scale-[1.04]"
            >
              Join Community
            </a>

          </div>
        </motion.div>
      </section>

      {/* STATS */}
      <section ref={statsRef} className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <StatCard key={i} stat={s} index={i} start={statsVisible} />
          ))}
        </div>
      </section>

      {/* ECOSYSTEM */}
      <section className="py-24 bg-brand-gray">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          {ecosystemCards.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 180 }}
              className="p-8 border border-brand-border rounded bg-black hover:border-brand-blue/40 transition"
            >
              <span className="text-brand-blue text-xs tracking-widest">{item.tag}</span>
              <item.icon className="text-brand-blue mt-4 mb-4" />
              <h3 className="text-white font-bebas text-3xl">{item.title}</h3>
              <p className="text-white/50 mt-2 text-sm">{item.description}</p>
              <Link href={item.href} className="text-brand-blue text-sm mt-4 inline-block">
                Learn more →
              </Link>
            </motion.div>
          ))}

        </div>
      </section>

    </PublicLayout>
  );
}