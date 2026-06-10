'use client';

import { Analytics } from '@vercel/analytics/next';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  ArrowRight, Users, Package, BookOpen,
  Zap, Globe, Shield, ChevronRight, Star,
  Activity, GraduationCap, Hammer, Settings,
} from 'lucide-react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import { useTheme } from '@/app/components/ThemeProvider';
import api from '@/app/lib/api';

/* ── Hero slides using confirmed image filenames ── */
const HERO_SLIDES = [
  {
    image:    '/images/hero/hero-workspace.jpg',
    label:    'Build Studio',
    tag:      'FOR BUILDERS',
    headline: 'TURN YOUR IDEA INTO A REAL PRODUCT',
    sub:      'Submit your product idea. We build it with you — from concept to production launch.',
    cta:      { label: 'Start a Build', href: '/build' },
  },
  {
    image:    '/images/hero/hero-main.jpg',
    label:    'Academy',
    tag:      'FOR STUDENTS',
    headline: 'LEARN BY BUILDING. NOT BY WATCHING.',
    sub:      'Every lesson is tied to a real product. Graduate with a portfolio that speaks for itself.',
    cta:      { label: 'Explore Academy', href: '/academy' },
  },
  {
    image:    '/images/hero/hero-team.jpg',
    label:    'Community',
    tag:      'FOR EVERYONE',
    headline: 'ONE ECOSYSTEM. INFINITE OPPORTUNITIES.',
    sub:      'One account unlocks the Academy, Build Studio, and a growing community of African builders.',
    cta:      { label: 'Join Free', href: '/register' },
  },
];

/* ── CountUp component ── */
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
    <div className="text-center">
      <p className="font-bebas text-4xl md:text-6xl text-[#1A3BDB]">{start ? count : 0}{suffix}</p>
      <p className="text-secondary text-sm mt-1">{label}</p>
    </div>
  );
}

const MODULES = [
  {
    icon: BookOpen, tag: 'LEARN', title: 'Academy',
    description: 'Project-based learning where every lesson builds toward a real product in your portfolio.',
    href: '/academy', features: ['Structured curriculum', 'Live mentorship', 'Ecosystem certificate'],
  },
  {
    icon: Package, tag: 'BUILD', title: 'Build Studio',
    description: 'We turn your product ideas into production-ready applications, from concept to launch.',
    href: '/build', features: ['Full-stack execution', 'MVP to production', 'Post-launch support'],
  },
  {
    icon: Users, tag: 'CONNECT', title: 'Community',
    description: 'A growing network of builders, designers, and founders collaborating and shipping together.',
    href: '/community', features: ['Ecosystem announcements', 'Builder network', 'Opportunity board'],
  },
];

const USER_PATHS = [
  {
    icon: GraduationCap,
    role: 'Student',
    headline: 'Learn & Build',
    desc: 'Enroll in a course. Build a real product. Graduate with a portfolio that opens doors.',
    cta: 'Apply to Academy',
    href: '/register?role=student',
    color: 'text-[#1A3BDB]',
    bg: 'bg-blue-50 dark:bg-[#1A3BDB]/10',
  },
  {
    icon: Hammer,
    role: 'Client',
    headline: 'Build Your Product',
    desc: 'Have a product idea? Our team builds it for you — design, development, and deployment.',
    cta: 'Submit Build Request',
    href: '/build',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
  },
  {
    icon: Users,
    role: 'Community',
    headline: 'Join the Ecosystem',
    desc: 'Connect with builders, access opportunities, and grow inside Africa\'s rising tech ecosystem.',
    cta: 'Join the Community',
    href: '/community',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-500/10',
  },
  {
    icon: Settings,
    role: 'Admin / Team',
    headline: 'Manage the OS',
    desc: 'Role-based access to the full ecosystem control center — students, builds, analytics, and more.',
    cta: 'Sign In',
    href: '/login',
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-500/10',
  },
];

const HOW_IT_WORKS = [
  { step: '01', icon: Users,    title: 'Create Your Account',     desc: 'Sign up as a student or client. Your ecosystem identity is created instantly.' },
  { step: '02', icon: Shield,   title: 'Verify Your Email',       desc: 'Enter the 6-digit OTP sent to your email. Account activates immediately.' },
  { step: '03', icon: Activity, title: 'Access Your Dashboard',   desc: 'Your personal OS dashboard is live. Explore courses, submit builds, and track everything.' },
  { step: '04', icon: Zap,      title: 'Learn, Build, or Launch', desc: 'Enroll in a course, submit a product idea, or join the builder community.' },
  { step: '05', icon: Globe,    title: 'Grow in the Ecosystem',   desc: 'Complete projects, earn recognition, and unlock new roles and opportunities.' },
];

const TECH = ['React', 'Next.js', 'Node.js', 'TypeScript', 'Supabase', 'NestJS', 'TailwindCSS', 'PostgreSQL', 'Python', 'AI/ML', 'Docker', 'Vercel'];

export default function HomePage() {
  const { theme }  = useTheme();
  const isDark     = theme === 'dark';
  const statsRef   = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);
  const [slideIndex, setSlideIndex]     = useState(0);
  const [liveStats, setLiveStats]       = useState({ active_users: 0, total_students: 0, total_builds: 0, completed_builds: 0 });
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [testimonials,  setTestimonials]  = useState<any[]>([]);
  const [platformStats, setPlatformStats] = useState<any[]>([]);

  // Auto-advance slider
  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex(i => (i + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Intersection observer for stats
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true); }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Load all data
  useEffect(() => {
    Promise.allSettled([
      api.get('/public/stats'),
      api.get('/public/announcements?limit=3'),
      api.get('/public/testimonials'),
      api.get('/public/platform-stats'),
    ]).then(([statsRes, announcementsRes, testimonialsRes, platformStatsRes]) => {
      if (statsRes.status === 'fulfilled')        setLiveStats(statsRes.value.data);
      if (announcementsRes.status === 'fulfilled') setAnnouncements(announcementsRes.value.data || []);
      if (testimonialsRes.status === 'fulfilled')  setTestimonials(testimonialsRes.value.data || []);
      if (platformStatsRes.status === 'fulfilled') setPlatformStats(platformStatsRes.value.data || []);
    });
  }, []);

  const displayStats = platformStats.length > 0
    ? platformStats.map((s: any) => ({ value: parseInt(s.value) || 0, suffix: '+', label: s.label }))
    : [
        { value: liveStats.total_students,    suffix: '+', label: 'Community Members' },
        { value: 6,                            suffix: '+', label: 'Ecosystem Modules' },
        { value: liveStats.total_builds,       suffix: '+', label: 'Build Requests' },
        { value: 100,                          suffix: '%', label: 'Execution Focused' },
      ];

  const slide = HERO_SLIDES[slideIndex];

  return (
    <PublicLayout>

      {/* ── HERO — full image slider, always dark ── */}
      <section className="relative min-h-screen flex items-end overflow-hidden hero-dark section-isolated pb-mobile-nav">

        {/* Slide images */}
        <AnimatePresence mode="sync">
          <motion.div
            key={slideIndex}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.label}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlay — bottom-heavy so content is readable */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Slide content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 pb-16 md:pb-24 pt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={slideIndex}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="max-w-3xl"
            >
              <div className="inline-flex items-center gap-2 border border-[#1A3BDB]/40 bg-[#1A3BDB]/15 px-3 py-1.5 mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A3BDB] pulse-dot" />
                <span className="text-[#1A3BDB] text-xs tracking-[0.2em] uppercase font-medium">{slide.tag}</span>
              </div>

              <h1 className="font-bebas text-[clamp(2.5rem,8vw,7rem)] leading-[0.9] text-white mb-5">
                {slide.headline}
              </h1>

              <p className="text-white/65 text-base md:text-xl leading-relaxed mb-8 max-w-xl">
                {slide.sub}
              </p>

              <div className="flex flex-col sm:flex-row items-start gap-3">
                <Link href={slide.cta.href}
                  className="group px-7 py-4 bg-[#1A3BDB] text-white font-semibold flex items-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#1A3BDB]/30"
                >
                  {slide.cta.label} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/register"
                  className="px-7 py-4 border border-white/25 text-white hover:border-white/50 hover:bg-white/5 transition-all text-center"
                >
                  Join Free
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slide indicators + mini labels */}
          <div className="flex items-center gap-4 mt-10">
            {HERO_SLIDES.map((s, i) => (
              <button
                key={i}
                onClick={() => setSlideIndex(i)}
                className={`flex items-center gap-2 transition-all ${
                  i === slideIndex ? 'opacity-100' : 'opacity-40 hover:opacity-70'
                }`}
              >
                <div className={`h-0.5 transition-all ${i === slideIndex ? 'w-8 bg-[#1A3BDB]' : 'w-4 bg-white'}`} />
                <span className="text-white text-xs hidden sm:block">{s.label}</span>
              </button>
            ))}

            {/* Live indicator */}
            <div className="ml-auto flex items-center gap-1.5">
              <motion.div animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-1.5 h-1.5 rounded-full bg-green-400" />
              <span className="text-white/30 text-xs">Live</span>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <motion.div animate={{ y: [0, 7, 0] }} transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20 pointer-events-none hidden md:flex"
        >
          <span className="text-[10px] tracking-widest uppercase">Scroll</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── WHAT IS TECHMINDSVERSE ── */}
      <section className="py-16 md:py-20 px-4 sm:px-6 border-b border-surface pub-section">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 px-4 py-1.5 inline-block mb-5 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
              What We Are
            </span>
            <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] leading-tight text-primary mb-5">
              ONE ACCOUNT.<br /><span className="text-[#1A3BDB]">EVERY MODULE.</span>
            </h2>
            <p className={`text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-8 ${isDark ? 'text-white/50' : 'text-gray-500'}`}>
              TechMindsVerse is a unified tech ecosystem platform. Create one account and unlock
              access to an academy, a product build studio, and a growing community of African builders.
              Every course builds a real product. Every builder gets real support.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10">
              {[
                { icon: BookOpen, label: 'Learn with purpose' },
                { icon: Package,  label: 'Build real products' },
                { icon: Users,    label: 'Grow in community' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isDark ? 'bg-[#1A3BDB]/12' : 'bg-blue-50'}`}>
                    <item.icon size={15} className="text-[#1A3BDB]" />
                  </div>
                  <span className={`text-sm font-medium ${isDark ? 'text-white/70' : 'text-gray-600'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── WHO IS IT FOR ── */}
      <section className="py-16 md:py-24 px-4 sm:px-6 border-b border-surface pub-section-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 px-4 py-1.5 inline-block mb-4 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
              Who Is It For
            </span>
            <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-primary">
              BUILT FOR EVERY<br /><span className="text-[#1A3BDB]">ECOSYSTEM PLAYER</span>
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {USER_PATHS.map((path, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pub-card border p-6 group"
              >
                <div className={`w-12 h-12 ${path.bg} rounded-xl flex items-center justify-center mb-4`}>
                  <path.icon size={22} className={path.color} />
                </div>
                <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${path.color}`}>{path.role}</p>
                <h3 className="font-bebas text-xl text-primary mb-2 leading-tight">{path.headline}</h3>
                <p className="text-secondary text-sm leading-relaxed mb-5">{path.desc}</p>
                <Link href={path.href} className={`text-sm font-medium flex items-center gap-1.5 group-hover:gap-2.5 transition-all ${path.color}`}>
                  {path.cta} <ArrowRight size={13} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section ref={statsRef} className="py-16 md:py-20 px-4 sm:px-6 border-b border-surface pub-section">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {displayStats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <CountUp target={s.value} suffix={s.suffix} label={s.label} start={statsVisible} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TECH MARQUEE ── */}
      <section className={`py-5 border-b border-surface overflow-hidden ${isDark ? 'bg-black' : 'bg-gray-50'}`}>
        <div className="flex gap-10 marquee-track">
          {[...TECH, ...TECH].map((tech, i) => (
            <span key={i} className={`text-sm font-medium whitespace-nowrap flex items-center gap-2.5 ${isDark ? 'text-white/20' : 'text-gray-400'}`}>
              <span className="w-1 h-1 rounded-full bg-[#1A3BDB]/60 shrink-0" />
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* ── ECOSYSTEM MODULES ── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 border-b border-surface pub-section-alt">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 px-4 py-1.5 inline-block mb-4 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
              Ecosystem
            </span>
            <h2 className="font-bebas text-[clamp(2rem,6vw,5rem)] text-primary leading-none mb-4">
              ONE PLATFORM.<br /><span className="text-[#1A3BDB]">MULTIPLE SYSTEMS.</span>
            </h2>
            <p className="text-secondary max-w-lg mx-auto text-sm md:text-base leading-relaxed">
              One account unlocks the academy, build studio, community, and future AI systems.
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
                className="group pub-card border overflow-hidden"
              >
                <div className="p-6 md:p-7">
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[#1A3BDB] text-xs tracking-[0.25em] border border-[#1A3BDB]/25 px-2 py-0.5 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
                      {mod.tag}
                    </span>
                    <ChevronRight size={13} className="text-secondary group-hover:text-[#1A3BDB] group-hover:translate-x-1 transition-all" />
                  </div>
                  <mod.icon size={26} className="text-[#1A3BDB] mb-4" />
                  <h3 className="font-bebas text-2xl text-primary mb-2">{mod.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed mb-5">{mod.description}</p>
                  <div className="space-y-1.5 mb-5">
                    {mod.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-muted text-xs">
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

      {/* ── ANNOUNCEMENTS — only if real data ── */}
      {announcements.length > 0 && (
        <section className="py-16 px-4 sm:px-6 border-b border-surface pub-section">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="flex items-center justify-between mb-8 flex-wrap gap-4"
            >
              <div>
                <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 px-4 py-1.5 inline-block mb-3 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
                  Updates
                </span>
                <h2 className="font-bebas text-3xl md:text-4xl text-primary">ECOSYSTEM UPDATES</h2>
              </div>
              <Link href="/community" className="text-[#1A3BDB] text-sm font-medium hover:underline">View all →</Link>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-4">
              {announcements.map((a, i) => (
                <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`pub-card border p-5 ${a.pinned ? 'border-[#1A3BDB]/20 bg-blue-50 dark:bg-[#1A3BDB]/5' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs text-[#1A3BDB] border border-[#1A3BDB]/25 px-2 py-0.5 capitalize ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
                      {a.type}
                    </span>
                    {a.pinned && <span className="text-muted text-xs">Pinned</span>}
                  </div>
                  <h3 className="text-primary font-semibold text-sm mb-2 leading-snug">{a.title}</h3>
                  <p className="text-secondary text-xs leading-relaxed line-clamp-3">{a.content}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 md:py-28 px-4 sm:px-6 border-b border-surface pub-section-alt">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className={`text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 px-4 py-1.5 inline-block mb-4 ${isDark ? 'bg-[#1A3BDB]/8' : 'bg-blue-50'}`}>
              How it works
            </span>
            <h2 className="font-bebas text-[clamp(2rem,6vw,4.5rem)] text-primary leading-none">
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
                    ${isDark ? 'border-[#1A3BDB]/30 bg-[#1A3BDB]/8 group-hover:bg-[#1A3BDB]/18' : 'border-blue-200 bg-blue-50 group-hover:bg-blue-100'}`}
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
                    <h3 className="font-bebas text-lg md:text-xl text-primary">{item.title}</h3>
                  </div>
                  <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS — only if real data ── */}
      {testimonials.length > 0 && (
        <section className="py-20 px-4 sm:px-6 border-b border-surface pub-section">
          <div className="max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
              <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-primary">
                VOICES FROM THE<br /><span className="text-[#1A3BDB]">ECOSYSTEM</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {testimonials.map((t: any, i: number) => (
                <motion.div key={t.id || i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="pub-card border p-6"
                >
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={11} className="text-[#1A3BDB] fill-[#1A3BDB]" />)}
                  </div>
                  <p className="text-secondary text-sm leading-relaxed mb-5">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1A3BDB]/15 border border-[#1A3BDB]/25 rounded-full flex items-center justify-center">
                      <span className="font-bebas text-[#1A3BDB] text-sm">{t.avatar_initial || t.name?.[0] || '?'}</span>
                    </div>
                    <div>
                      <p className="text-primary text-sm font-semibold">{t.name}</p>
                      <p className="text-muted text-xs">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ── */}
      <section className={`py-20 md:py-28 px-4 sm:px-6 relative overflow-hidden pub-section-alt`}>
        <div className={`absolute inset-0 pointer-events-none ${isDark ? 'bg-gradient-to-br from-[#1A3BDB]/8 via-transparent to-purple-500/8' : 'bg-gradient-to-br from-blue-50 via-white to-indigo-50'}`} />
        <motion.div initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto text-center relative z-10">
          <span className="font-bebas text-[#1A3BDB] text-xs tracking-[0.4em] block mb-4">START NOW</span>
          <h2 className="font-bebas text-[clamp(2.5rem,8vw,6rem)] text-primary leading-none mb-5">
            READY TO BUILD<br /><span className="text-[#1A3BDB]">SOMETHING REAL?</span>
          </h2>
          <p className="text-secondary leading-relaxed mb-10 text-sm md:text-base">
            Create your free account. Join the ecosystem. Start building today.
          </p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link href="/register"
              className="group px-8 py-4 bg-[#1A3BDB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#1A3BDB]/20"
            >
              Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/about"
              className={`px-8 py-4 border font-medium text-center transition-all ${isDark ? 'border-white/20 text-white hover:border-white/40' : 'border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50'}`}
            >
              Learn More
            </Link>
          </div>
          <p className="text-muted text-xs mt-5">No credit card required · Free to join · Instant access</p>
        </motion.div>
      </section>

      <Analytics />
    </PublicLayout>
  );
}