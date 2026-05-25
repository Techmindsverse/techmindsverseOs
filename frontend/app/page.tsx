'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Users, Package, BookOpen,
  Zap, Globe, Shield, ChevronRight,
  Star, Activity
} from 'lucide-react';
import PublicLayout from '@/app/components/layout/PublicLayout';

/* ============================================
   STABLE PARTICLE DATA — generated once, client-only
   Fixes hydration mismatch from Math.random() on server
   ============================================ */
const PARTICLE_DATA = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  x: (i * 7.3 + 3) % 100,
  delay: i * 0.6,
  duration: 9 + (i % 5),
}));

const ORB_DATA = [
  { top: '20%', left: '15%', w: 500, h: 500, color: 'bg-brand-blue/[0.07]', blur: 'blur-[140px]', delay: 0 },
  { top: '60%', right: '10%', w: 400, h: 400, color: 'bg-purple-600/[0.06]', blur: 'blur-[130px]', delay: 2 },
  { top: '40%', left: '45%', w: 250, h: 250, color: 'bg-brand-blue/[0.04]', blur: 'blur-[100px]', delay: 4 },
];

/* ============================================
   COUNT UP HOOK
   ============================================ */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return count;
}

/* ============================================
   TYPED TEXT — client-only, no SSR mismatch
   ============================================ */
function TypedText({ words }: { words: string[] }) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const word = words[index];
    const timeout = setTimeout(() => {
      if (!deleting && displayed.length < word.length) {
        setDisplayed(word.slice(0, displayed.length + 1));
      } else if (!deleting && displayed.length === word.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && displayed.length > 0) {
        setDisplayed(displayed.slice(0, -1));
      } else {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      }
    }, deleting ? 35 : 75);
    return () => clearTimeout(timeout);
  }, [mounted, displayed, deleting, index, words]);

  if (!mounted) {
    return <span className="text-brand-blue">{words[0]}</span>;
  }

  return (
    <span className="text-brand-blue">
      {displayed}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="inline-block w-[3px] h-[0.85em] bg-brand-blue ml-1 align-middle"
      />
    </span>
  );
}

/* ============================================
   PARTICLE — purely CSS-driven, stable positions
   ============================================ */
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLE_DATA.map((p) => (
        <motion.div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-brand-blue/50"
          style={{ left: `${p.x}%`, bottom: '-4px' }}
          animate={{ y: [0, -900], opacity: [0, 0.8, 0.8, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}

/* ============================================
   DATA
   ============================================ */
const STATS = [
  { value: 50, suffix: '+', label: 'Community Members' },
  { value: 6, suffix: '+', label: 'Ecosystem Modules' },
  { value: 10, suffix: '+', label: 'Active Builders' },
  { value: 100, suffix: '%', label: 'Execution Focused' },
];

const MODULES = [
  {
    icon: BookOpen, tag: 'LEARN', title: 'Academy',
    description: 'Project-based learning where students build real-world products from day one.',
    href: '/academy', gradient: 'from-blue-600/20',
    features: ['Structured curriculum', 'Live mentorship', 'Certificates'],
  },
  {
    icon: Package, tag: 'BUILD', title: 'Build Studio',
    description: 'We turn your ideas into production-ready digital products from concept to launch.',
    href: '/build', gradient: 'from-purple-600/20',
    features: ['MVP development', 'Full-stack execution', 'Post-launch support'],
  },
  {
    icon: Users, tag: 'CONNECT', title: 'Community',
    description: 'A growing network of builders, designers, and founders collaborating globally.',
    href: 'https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH', gradient: 'from-green-600/20',
    features: ['Networking events', 'Collaboration tools', 'Opportunity board'],
  },
];

const TECH = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Supabase', 'NestJS', 'TailwindCSS', 'PostgreSQL', 'Vercel', 'Python', 'AI/ML', 'Docker'];

const TESTIMONIALS = [
  { name: 'Vera Chinecherem', role: 'Student', text: 'TechMindsVerse gave me a clear path from learning to building real products.' },
  { name: 'Kenlight', role: 'Client', text: 'The Build Studio team turned my idea into a working product in weeks.' },
  { name: 'Sheddy De Coder', role: 'Founder', text: 'Built this to bridge the gap between talent and opportunity in tech.' },
];

const HOW_IT_WORKS = [
  { step: '01', icon: Users, title: 'Create Your Account', desc: 'Sign up as a student or client. Identity created instantly.' },
  { step: '02', icon: Shield, title: 'Verify Your Email', desc: 'Enter the OTP. Account activates immediately.' },
  { step: '03', icon: Activity, title: 'Access Your Dashboard', desc: 'Your OS dashboard is live. Explore, build, track.' },
  { step: '04', icon: Zap, title: 'Learn, Build, or Launch', desc: 'Enroll in courses, submit a product idea, join community.' },
  { step: '05', icon: Globe, title: 'Grow in the Ecosystem', desc: 'Complete projects, earn badges, unlock opportunities.' },
];

/* ============================================
   STAT CARD
   ============================================ */
function StatCard({ stat, index, start }: { stat: typeof STATS[0]; index: number; start: boolean }) {
  const count = useCountUp(stat.value, 2000, start);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="text-center group"
    >
      <p className="font-bebas text-5xl md:text-7xl bg-gradient-to-b from-white to-brand-blue bg-clip-text text-transparent">
        {count}{stat.suffix}
      </p>
      <p className="text-white/40 text-sm mt-1 tracking-wide">{stat.label}</p>
    </motion.div>
  );
}

/* ============================================
   PAGE
   ============================================ */
export default function HomePage() {
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 800], [0, -60]);
  const yText = useTransform(scrollY, [0, 600], [0, -25]);
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0.88]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <PublicLayout>

      {/* ───────── HERO ───────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-mobile-nav">

        {/* Grid */}
        <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(26,59,219,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26,59,219,1) 1px, transparent 1px)`,
            backgroundSize: '55px 55px',
          }} />
        </motion.div>

        {/* Orbs — stable positions, no random */}
        {ORB_DATA.map((orb, i) => (
          <motion.div
            key={i}
            className={`absolute rounded-full ${orb.color} ${orb.blur} pointer-events-none`}
            style={{
              width: orb.w,
              height: orb.h,
              top: orb.top,
              left: 'left' in orb ? orb.left : undefined,
              right: 'right' in orb ? (orb as any).right : undefined,
            }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7 + i * 2, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
          />
        ))}

        <Particles />

        {/* Content */}
        <motion.div
          style={{ y: yText, opacity: opacityHero }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 text-center"
        >

          {/* Live badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-brand-blue/30 bg-brand-blue/5 px-4 py-2 mb-6 md:mb-8"
          >
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-brand-blue pulse-dot"
            />
            <span className="text-brand-blue text-xs tracking-[0.25em] uppercase">
              TechMindsVerse OS — Phase 1 Live
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="font-bebas leading-[0.88] tracking-wide text-[clamp(3rem,10.5vw,9.5rem)] mb-5"
          >
            <span className="block text-white">WHERE TALENT</span>
            <span className="block">
              <TypedText words={['LEARNS', 'BUILDS', 'SHIPS', 'GROWS', 'LEADS']} />
            </span>
            <span className="block text-white">& IDEAS LAUNCH</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed px-4"
          >
            One ecosystem. One identity. Academy, Build Studio, Community, and AI — all connected.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12 md:mb-16 px-4"
          >
            <Link href="/register" className="group w-full sm:w-auto px-7 py-4 bg-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-brand-blue/25 hover:-translate-y-0.5">
              Join the Ecosystem
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/academy" className="w-full sm:w-auto px-7 py-4 border border-white/20 text-white hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all text-center">
              Explore Academy
            </Link>
            <Link href="/build" className="w-full sm:w-auto px-7 py-3 text-white/50 hover:text-white transition-colors text-sm text-center">
              Build a Product →
            </Link>
          </motion.div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="relative max-w-3xl mx-auto hidden md:block"
          >
            <div className="border border-white/8 bg-black/80 backdrop-blur-sm p-1 shadow-2xl shadow-brand-blue/10">
              <div className="border border-white/5 bg-black p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-brand-blue rounded-sm flex items-center justify-center">
                      <span className="font-bebas text-white text-[10px]">T</span>
                    </div>
                    <span className="font-bebas text-white/60 text-xs tracking-widest">TECHMINDSVERSE OS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/25 text-xs">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Students', value: '50+', color: 'text-white' },
                    { label: 'Builds', value: '12', color: 'text-brand-blue' },
                    { label: 'Revenue', value: '₦2.4M', color: 'text-green-400' },
                    { label: 'Active', value: '100%', color: 'text-purple-400' },
                  ].map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 + i * 0.1 }} className="border border-white/5 p-2.5 text-center">
                      <p className="text-white/25 text-[10px] mb-1">{m.label}</p>
                      <p className={`font-bebas text-lg ${m.color}`}>{m.value}</p>
                    </motion.div>
                  ))}
                </div>
                <div className="space-y-2">
                  {[
                    { text: 'New enrollment: Full-Stack Development', time: '2m ago', dot: 'bg-brand-blue' },
                    { text: 'Build request submitted: Fintech App', time: '15m ago', dot: 'bg-purple-400' },
                    { text: 'Payment approved: ₦50,000', time: '1h ago', dot: 'bg-green-400' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.35 + i * 0.12 }} className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0">
                      <div className={`w-1.5 h-1.5 rounded-full ${item.dot} shrink-0`} />
                      <span className="text-white/35 text-xs flex-1 truncate">{item.text}</span>
                      <span className="text-white/20 text-[10px] shrink-0">{item.time}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-brand-blue/15 blur-2xl" />
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/15 pointer-events-none">
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ───────── STATS ───────── */}
      <section ref={statsRef} className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/5 via-transparent to-purple-500/5 pointer-events-none" />
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-12">
            {STATS.map((s, i) => <StatCard key={i} stat={s} index={i} start={statsVisible} />)}
          </div>
        </div>
      </section>

      {/* ───────── TECH MARQUEE ───────── */}
      <section className="py-6 border-y border-white/5 overflow-hidden">
        <div className="flex gap-10 marquee-track">
          {[...TECH, ...TECH].map((tech, i) => (
            <span key={i} className="text-white/20 text-sm font-medium whitespace-nowrap flex items-center gap-2.5">
              <span className="w-1 h-1 rounded-full bg-brand-blue/50 shrink-0" />
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ───────── ECOSYSTEM MODULES ───────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-4">Ecosystem</span>
            <h2 className="font-bebas text-[clamp(2rem,6vw,5rem)] text-white leading-none">
              ONE PLATFORM.<br />
              <span className="text-brand-blue">MULTIPLE SYSTEMS.</span>
            </h2>
            <p className="text-white/40 max-w-lg mx-auto mt-4 text-sm md:text-base leading-relaxed">
              One account unlocks academy, build studio, community, and future AI systems.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5">
            {MODULES.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group relative border border-white/5 bg-black overflow-hidden hover:border-brand-blue/30 transition-all duration-400"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative p-6 md:p-8">
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-brand-blue text-xs tracking-[0.25em] border border-brand-blue/30 px-2 py-0.5">{mod.tag}</span>
                    <ChevronRight size={13} className="text-white/15 group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                  </div>
                  <mod.icon size={26} className="text-brand-blue mb-4" />
                  <h3 className="font-bebas text-2xl md:text-3xl text-white mb-2">{mod.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed mb-5">{mod.description}</p>
                  <div className="space-y-1.5 mb-6">
                    {mod.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-white/30 text-xs">
                        <div className="w-1 h-1 rounded-full bg-brand-blue/60 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href={mod.href} className="text-brand-blue text-sm flex items-center gap-1.5 group-hover:gap-2 transition-all">
                    Explore {mod.title} <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── HOW IT WORKS ───────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12 md:mb-16">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-4">How it works</span>
            <h2 className="font-bebas text-[clamp(2rem,6vw,4.5rem)] text-white">
              FROM ZERO TO<br /><span className="text-brand-blue">ECOSYSTEM BUILDER</span>
            </h2>
          </motion.div>
          <div className="space-y-0">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex gap-5 md:gap-7 items-start group"
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div className="w-10 h-10 md:w-12 md:h-12 border border-brand-blue/30 bg-brand-blue/8 flex items-center justify-center group-hover:bg-brand-blue/18 transition-colors">
                    <item.icon size={16} className="text-brand-blue" />
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="w-px flex-1 bg-gradient-to-b from-brand-blue/20 to-transparent min-h-[32px] my-1" />
                  )}
                </div>
                <div className="flex-1 pb-7">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-bebas text-brand-blue/35 text-base">{item.step}</span>
                    <h3 className="font-bebas text-lg md:text-xl text-white">{item.title}</h3>
                  </div>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── TESTIMONIALS ───────── */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-white">
              VOICES FROM THE<br /><span className="text-brand-blue">ECOSYSTEM</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-white/5 p-6 hover:border-white/10 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-brand-blue fill-brand-blue" />)}
                </div>
                <p className="text-white/50 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-brand-blue/15 border border-brand-blue/25 rounded-full flex items-center justify-center">
                    <span className="font-bebas text-brand-blue text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-white/30 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── CTA ───────── */}
      <section className="py-24 md:py-32 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/8 via-transparent to-purple-500/8" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center relative z-10">
          <span className="font-bebas text-brand-blue text-xs tracking-[0.4em] block mb-4">START NOW</span>
          <h2 className="font-bebas text-[clamp(2.5rem,8vw,6rem)] leading-none text-white mb-5">
            READY TO BUILD<br /><span className="text-brand-blue">SOMETHING REAL?</span>
          </h2>
          <p className="text-white/40 leading-relaxed mb-10 text-sm md:text-base">
            Create your free account. Join the ecosystem. Start building today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/register" className="group w-full sm:w-auto px-8 py-4 bg-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:shadow-xl hover:shadow-brand-blue/20 hover:-translate-y-0.5">
              Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className="w-full sm:w-auto px-8 py-4 border border-white/20 text-white hover:border-white/40 transition-all text-center">
              Learn More
            </Link>
          </div>
          <p className="text-white/15 text-xs mt-5">No credit card · Free to join · Instant access</p>
        </motion.div>
      </section>

      <Analytics />
    </PublicLayout>
  );
}