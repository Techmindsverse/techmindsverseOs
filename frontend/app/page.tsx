'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Users, Package, BookOpen,
  Zap, Globe, Shield, ChevronRight, Star, Activity,
} from 'lucide-react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import { useTheme } from '@/app/components/ThemeProvider';
import api from '@/app/lib/api';

/* ── Stable particle data ── */
const PARTICLES = Array.from({ length: 14 }, (_, i) => ({
  id: i,
  x: ((i * 7.3 + 11) % 97).toFixed(1),
  duration: 9 + (i % 6),
  delay: i * 0.55,
}));

/* ── Typed text ── */
function TypedText({ words }: { words: string[] }) {
  const [mounted, setMounted] = useState(false);
  const [index, setIndex]     = useState(0);
  const [text, setText]       = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const word = words[index];
    const t = setTimeout(() => {
      if (!deleting && text.length < word.length) {
        setText(word.slice(0, text.length + 1));
      } else if (!deleting && text.length === word.length) {
        setTimeout(() => setDeleting(true), 1400);
      } else if (deleting && text.length > 0) {
        setText(text.slice(0, -1));
      } else {
        setDeleting(false);
        setIndex((index + 1) % words.length);
      }
    }, deleting ? 35 : 75);
    return () => clearTimeout(t);
  }, [mounted, text, deleting, index, words]);

  return (
    <span className="text-[#1A3BDB]">
      {mounted ? text : words[0]}
      {mounted && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[3px] h-[0.82em] bg-[#1A3BDB] ml-1 align-middle"
        />
      )}
    </span>
  );
}

/* ── Particles ── */
function Particles() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {PARTICLES.map(p => (
        <div
          key={p.id}
          className="absolute w-1 h-1 rounded-full bg-[#1A3BDB]/40 particle"
          style={{
            left: `${p.x}%`, bottom: '-4px',
            '--duration': `${p.duration}s`,
            '--delay': `${p.delay}s`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ── Count up — component, not a hook called in map ── */
function CountUp({ target, suffix, label, start }: {
  target: number; suffix: string; label: string; start: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start || target === 0) { setCount(0); return; }
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / 1800, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center"
    >
      <p className="font-bebas text-5xl md:text-7xl text-[#1A3BDB]">
        {start ? count : 0}{suffix}
      </p>
      <p className="text-secondary text-sm mt-1">{label}</p>
    </motion.div>
  );
}

/* ── Static data ── */
const MODULES = [
  {
    icon: BookOpen, tag: 'LEARN', title: 'Academy',
    description: 'Project-based learning where every lesson builds toward a real product in your portfolio.',
    href: '/academy', gradient: 'from-blue-600/15',
    features: ['Structured curriculum', 'Live mentorship', 'Ecosystem certificate'],
  },
  {
    icon: Package, tag: 'BUILD', title: 'Build Studio',
    description: 'We turn your product ideas into production-ready applications, from concept to launch.',
    href: '/build', gradient: 'from-purple-600/15',
    features: ['Full-stack execution', 'MVP to production', 'Post-launch support'],
  },
  {
    icon: Users, tag: 'CONNECT', title: 'Community',
    description: 'A growing network of builders, designers, and founders collaborating and shipping together.',
    href: '/community', gradient: 'from-green-600/15',
    features: ['Ecosystem announcements', 'Builder network', 'Opportunity board'],
  },
];

const TECH = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Supabase', 'NestJS', 'TailwindCSS', 'PostgreSQL', 'Vercel', 'Python', 'AI/ML', 'Docker'];

const HOW_IT_WORKS = [
  { step: '01', icon: Users,    title: 'Create Your Account',     desc: 'Sign up as a student or client. Your ecosystem identity is created instantly.' },
  { step: '02', icon: Shield,   title: 'Verify Your Email',       desc: 'Enter the 6-digit OTP sent to your email. Your account activates immediately.' },
  { step: '03', icon: Activity, title: 'Access Your Dashboard',   desc: 'Your personal OS dashboard is live. Explore courses, submit builds, and track everything.' },
  { step: '04', icon: Zap,      title: 'Learn, Build, or Launch', desc: 'Enroll in a course, submit a product idea, or join the builder community.' },
  { step: '05', icon: Globe,    title: 'Grow in the Ecosystem',   desc: 'Complete projects, earn recognition, unlock new roles and opportunities.' },
];

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const { scrollY } = useScroll();
  const yBg   = useTransform(scrollY, [0, 800], [0, -55]);
  const yText  = useTransform(scrollY, [0, 600], [0, -22]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0.88]);

  const [liveStats,     setLiveStats]     = useState({ active_users: 0, total_students: 0, total_builds: 0, completed_builds: 0 });
  const [testimonials,  setTestimonials]  = useState<any[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any[]>([]);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    Promise.allSettled([
      api.get('/public/stats'),
      api.get('/public/testimonials'),
      api.get('/public/announcements?limit=3'),
      api.get('/public/platform-stats'),
    ]).then(([statsRes, testimonialsRes, announcementsRes, platformStatsRes]) => {
      if (statsRes.status === 'fulfilled')        setLiveStats(statsRes.value.data);
      if (testimonialsRes.status === 'fulfilled')  setTestimonials(testimonialsRes.value.data || []);
      if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value.data || []);
      if (platformStatsRes.status === 'fulfilled') setPlatformStats(platformStatsRes.value.data || []);
    });
  }, []);

  // REAL data only — no fake fallbacks
  const displayStats = platformStats.length > 0
    ? platformStats.map((s: any) => ({ value: parseInt(s.value) || 0, suffix: '+', label: s.label }))
    : [
        { value: liveStats.total_students,    suffix: '+', label: 'Community Members' },
        { value: 6,                            suffix: '+', label: 'Ecosystem Modules' },
        { value: liveStats.total_builds,       suffix: '+', label: 'Build Requests' },
        { value: 100,                          suffix: '%', label: 'Execution Focused' },
      ];

  const displayTestimonials = testimonials.length > 0 ? testimonials : [];

  // Styles that adapt to theme
  const sectionBorder = isDark ? 'border-white/5' : 'border-gray-100';
  const textH2  = isDark ? 'text-white' : 'text-gray-900';
  const textSub = isDark ? 'text-white/40' : 'text-gray-500';
  const textMuted = isDark ? 'text-white/25' : 'text-gray-400';
  const cardBg  = isDark ? 'bg-black border-white/5 hover:border-white/15' : 'bg-white border-gray-100 hover:border-[#1A3BDB]/20 shadow-sm hover:shadow-md';
  const tagBg   = isDark ? 'border-[#1A3BDB]/30 bg-[#1A3BDB]/5' : 'border-blue-200 bg-blue-50';

  return (
    <PublicLayout>

      {/* ── HERO — always dark for visual impact, but clean ── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-mobile-nav hero-dark section-isolated">
        <motion.div style={{ y: yBg }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: `linear-gradient(rgba(26,59,219,1) 1px, transparent 1px), linear-gradient(90deg, rgba(26,59,219,1) 1px, transparent 1px)`,
            backgroundSize: '55px 55px',
          }} />
        </motion.div>

        <div className="absolute top-1/3 left-1/5 w-[420px] h-[420px] bg-[#1A3BDB]/[0.07] rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[320px] h-[320px] bg-purple-600/[0.05] rounded-full blur-[110px] pointer-events-none" />
        <Particles />

        <motion.div style={{ y: yText, opacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">

          {/* Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 border border-[#1A3BDB]/30 bg-[#1A3BDB]/8 px-4 py-2 mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A3BDB] pulse-dot" />
            <span className="text-[#1A3BDB] text-xs tracking-[0.25em] uppercase">TechMindsVerse OS · Phase 1 Live</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="font-bebas leading-[0.9] tracking-wide text-[clamp(2.8rem,10vw,9rem)] mb-5"
          >
            <span className="block text-white">WHERE TALENT</span>
            <span className="block"><TypedText words={['LEARNS', 'BUILDS', 'SHIPS', 'GROWS', 'LEADS']} /></span>
            <span className="block text-white">& IDEAS LAUNCH</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-white/50 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed px-2"
          >
            One account. Academy, Build Studio, Community — all connected.
            Learn real skills, build real products, grow in a real ecosystem.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 mb-14 px-2"
          >
            <Link href="/register" className="group px-7 py-4 bg-[#1A3BDB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1A3BDB]/25">
              Join the Ecosystem Free <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/academy" className="px-7 py-4 border border-white/20 text-white hover:border-white/40 hover:bg-white/5 transition-all text-center">
              Explore Academy
            </Link>
            <Link href="/build" className="px-7 py-3 text-white/40 hover:text-white transition-colors text-sm text-center">
              Build a Product →
            </Link>
          </motion.div>

          {/* Mini dashboard preview — desktop only */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85, duration: 0.7 }}
            className="relative max-w-3xl mx-auto hidden md:block"
          >
            <div className="border border-white/8 bg-black/80 p-1 shadow-2xl shadow-[#1A3BDB]/10">
              <div className="border border-white/5 bg-black p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
                  <div className="flex items-center gap-2">
                    <img src="/logo.png" alt="" className="w-5 h-5 rounded-sm" />
                    <span className="font-bebas text-white/60 text-xs tracking-widest">TECHMINDSVERSE OS</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-green-400" />
                    <span className="text-white/25 text-xs">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[
                    { label: 'Students',  value: liveStats.total_students || '—' },
                    { label: 'Builds',    value: liveStats.total_builds || '—',    color: 'text-[#1A3BDB]' },
                    { label: 'Completed', value: liveStats.completed_builds || '—', color: 'text-green-400' },
                    { label: 'Modules',   value: '6',                               color: 'text-purple-400' },
                  ].map((m, i) => (
                    <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 + i * 0.1 }}
                      className="border border-white/5 p-2.5 text-center"
                    >
                      <p className="text-white/25 text-[10px] mb-1">{m.label}</p>
                      <p className={`font-bebas text-lg ${m.color || 'text-white'}`}>{m.value}</p>
                    </motion.div>
                  ))}
                </div>
                {announcements.length > 0 && (
                  <div className="space-y-2">
                    {announcements.slice(0, 2).map((a, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1.35 + i * 0.12 }}
                        className="flex items-center gap-3 py-1.5 border-b border-white/5 last:border-0"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#1A3BDB] shrink-0" />
                        <span className="text-white/35 text-xs flex-1 truncate">{a.title}</span>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-10 bg-[#1A3BDB]/12 blur-2xl" />
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/15 pointer-events-none"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── WHAT IS TECHMINDSVERSE — light section ── */}
      <section className={`py-16 md:py-20 px-4 sm:px-6 border-b ${sectionBorder} pub-section`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border px-4 py-1.5 inline-block mb-5 ${tagBg}`}>
              What We Are
            </span>
            <h2 className={`font-bebas text-[clamp(2rem,5vw,4rem)] leading-tight mb-5 ${textH2}`}>
              ONE ECOSYSTEM.<br />
              <span className="text-[#1A3BDB]">INFINITE POSSIBILITIES.</span>
            </h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 ${textSub}`}>
              TechMindsVerse is a unified tech platform where you create <strong className="text-[#1A3BDB]">one account</strong> and
              unlock access to an academy, a product build studio, and a growing community of builders.
              We bridge the gap between learning and doing — every course builds a real product,
              every builder gets real support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { label: 'Learn with purpose', icon: BookOpen },
                { label: 'Build real products', icon: Package },
                { label: 'Grow in community', icon: Users },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#1A3BDB]/10 flex items-center justify-center">
                    <item.icon size={15} className="text-[#1A3BDB]" />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
<section ref={statsRef} className="py-20 md:py-28 relative overflow-hidden pub-section-alt">
  <div className="max-w-5xl mx-auto px-4 sm:px-6">
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
      {displayStats.map((s, i) => (
        <CountUp
          key={i}
          target={s.value}
          suffix={s.suffix}
          label={s.label}
          start={statsVisible}
        />
      ))}
    </div>
  </div>
</section>
      {/* ── TECH MARQUEE ── */}
      <section className={`py-5 border-b ${sectionBorder} overflow-hidden pub-section`}>
        <div className="flex gap-10 marquee-track">
          {[...TECH, ...TECH].map((tech, i) => (
            <span key={i} className={`text-sm font-medium whitespace-nowrap flex items-center gap-2.5 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              <span className="w-1 h-1 rounded-full bg-[#1A3BDB]/50 shrink-0" />
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── ECOSYSTEM MODULES ── */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 border-b ${sectionBorder} pub-section`}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border px-4 py-1.5 inline-block mb-4 ${tagBg}`}>
              Ecosystem
            </span>
            <h2 className={`font-bebas text-[clamp(2rem,6vw,5rem)] leading-none mb-4 ${textH2}`}>
              ONE PLATFORM.<br />
              <span className="text-[#1A3BDB]">MULTIPLE SYSTEMS.</span>
            </h2>
            <p className={`max-w-lg mx-auto text-sm md:text-base leading-relaxed ${textSub}`}>
              One account unlocks the academy, build studio, community, and future AI systems.
              Your journey grows as you do.
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
                className={`group relative border overflow-hidden transition-all duration-300 pub-card`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${mod.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative p-6 md:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[#1A3BDB] text-xs tracking-[0.25em] border px-2 py-0.5 ${tagBg}`}>{mod.tag}</span>
                    <ChevronRight size={13} className={`${isDark ? 'text-white/15' : 'text-gray-300'} group-hover:text-[#1A3BDB] group-hover:translate-x-1 transition-all`} />
                  </div>
                  <mod.icon size={26} className="text-[#1A3BDB] mb-4" />
                  <h3 className={`font-bebas text-2xl mb-2 ${textH2}`}>{mod.title}</h3>
                  <p className={`text-sm leading-relaxed mb-5 ${textSub}`}>{mod.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {mod.features.map((f, j) => (
                      <div key={j} className={`flex items-center gap-2 text-xs ${isDark ? 'text-white/30' : 'text-gray-400'}`}>
                        <div className="w-1 h-1 rounded-full bg-[#1A3BDB]/60 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <Link href={mod.href} className="text-[#1A3BDB] text-sm flex items-center gap-1.5 group-hover:gap-2.5 transition-all font-medium">
                    Explore {mod.title} <ArrowRight size={13} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ANNOUNCEMENTS — only if real data exists ── */}
      {announcements.length > 0 && (
        <section className={`py-16 px-4 sm:px-6 border-b ${sectionBorder} pub-section-alt`}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-center justify-between mb-8 flex-wrap gap-4"
            >
              <div>
                <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border px-4 py-1.5 inline-block mb-3 ${tagBg}`}>Updates</span>
                <h2 className={`font-bebas text-3xl md:text-4xl ${textH2}`}>ECOSYSTEM UPDATES</h2>
              </div>
              <Link href="/community" className="text-[#1A3BDB] text-sm font-medium hover:underline">View all →</Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-4">
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`pub-card border p-5 ${a.pinned ? 'border-[#1A3BDB]/20 bg-[#1A3BDB]/4' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs text-[#1A3BDB] border px-2 py-0.5 capitalize ${tagBg}`}>{a.type}</span>
                    {a.pinned && <span className={`text-xs ${isDark ? 'text-white/20' : 'text-gray-400'}`}>Pinned</span>}
                  </div>
                  <h3 className={`font-medium text-sm mb-2 leading-snug ${textH2}`}>{a.title}</h3>
                  <p className={`text-xs leading-relaxed line-clamp-3 ${textSub}`}>{a.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 border-b ${sectionBorder} pub-section`}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border px-4 py-1.5 inline-block mb-4 ${tagBg}`}>How it works</span>
            <h2 className={`font-bebas text-[clamp(2rem,6vw,4.5rem)] leading-none ${textH2}`}>
              FROM ZERO TO<br /><span className="text-[#1A3BDB]">ECOSYSTEM BUILDER</span>
            </h2>
          </motion.div>
          <div className="space-y-0">
            {HOW_IT_WORKS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-5 md:gap-7 items-start group"
              >
                <div className="shrink-0 flex flex-col items-center">
                  <div className={`w-10 h-10 md:w-12 md:h-12 border flex items-center justify-center transition-colors
                    ${isDark
                      ? 'border-[#1A3BDB]/30 bg-[#1A3BDB]/8 group-hover:bg-[#1A3BDB]/18'
                      : 'border-blue-200 bg-blue-50 group-hover:bg-blue-100'
                    }`}
                  >
                    <item.icon size={16} className="text-[#1A3BDB]" />
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className={`w-px flex-1 bg-gradient-to-b min-h-[28px] my-1 ${isDark ? 'from-[#1A3BDB]/20 to-transparent' : 'from-blue-200 to-transparent'}`} />
                  )}
                </div>
                <div className="flex-1 pb-6">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className="font-bebas text-[#1A3BDB]/40 text-base">{item.step}</span>
                    <h3 className={`font-bebas text-lg md:text-xl ${textH2}`}>{item.title}</h3>
                  </div>
                  <p className={`text-sm leading-relaxed ${textSub}`}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — only if real data exists ── */}
      {displayTestimonials.length > 0 && (
        <section className={`py-24 px-4 sm:px-6 border-b ${sectionBorder} pub-section-alt`}>
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className={`font-bebas text-[clamp(2rem,5vw,4rem)] ${textH2}`}>
                VOICES FROM THE<br /><span className="text-[#1A3BDB]">ECOSYSTEM</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {displayTestimonials.map((t: any, i: number) => (
                <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="pub-card border p-6"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-[#1A3BDB] fill-[#1A3BDB]" />)}
                  </div>
                  <p className={`text-sm leading-relaxed mb-5 ${textSub}`}>"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1A3BDB]/15 border border-[#1A3BDB]/25 rounded-full flex items-center justify-center">
                      <span className="font-bebas text-[#1A3BDB] text-sm">{t.avatar_initial || t.name?.[0] || '?'}</span>
                    </div>
                    <div>
                      <p className={`text-sm font-medium ${textH2}`}>{t.name}</p>
                      <p className={`text-xs ${textMuted}`}>{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 pub-section relative overflow-hidden`}>
        <div className="absolute inset-0 pointer-events-none">
          <div className={`absolute inset-0 ${isDark ? 'bg-gradient-to-br from-[#1A3BDB]/8 via-transparent to-purple-500/8' : 'bg-gradient-to-br from-blue-50 via-white to-purple-50'}`} />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1A3BDB]/30 to-transparent" />
          <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#1A3BDB]/30 to-transparent" />
        </div>
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <span className="font-bebas text-[#1A3BDB] text-xs tracking-[0.4em] block mb-4">START NOW</span>
          <h2 className={`font-bebas text-[clamp(2.5rem,8vw,6rem)] leading-none mb-5 ${textH2}`}>
            READY TO BUILD<br /><span className="text-[#1A3BDB]">SOMETHING REAL?</span>
          </h2>
          <p className={`leading-relaxed mb-10 text-sm md:text-base ${textSub}`}>
            Create your free account today. Join the ecosystem. Start building.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/register" className="group px-8 py-4 bg-[#1A3BDB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1A3BDB]/20">
              Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about" className={`px-8 py-4 border font-medium text-center transition-all
              ${isDark ? 'border-white/20 text-white hover:border-white/40' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              Learn More
            </Link>
          </div>
          <p className={`text-xs mt-5 ${isDark ? 'text-white/15' : 'text-gray-400'}`}>
            No credit card required · Free to join · Instant access
          </p>
        </motion.div>
      </section>

      <Analytics />
    </PublicLayout>
  );
}