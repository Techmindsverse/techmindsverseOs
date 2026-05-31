'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/app/lib/api';
import { useAuthStore } from '@/app/lib/store/auth.store';
import PublicLayout from '@/app/components/layout/PublicLayout';
import {
  ArrowRight, Clock, Users, CheckCircle,
  Code2, Palette, Brain, Video, BookOpen,
  Star, Play, Lock, Zap, Globe, Award,
  ChevronRight, Layers
} from 'lucide-react';

/* ── Types ── */
interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  overview: string;
  duration: string;
  level: string;
  category: string;
  instructor_name: string;
  thumbnail_url?: string;
}

interface Enrollment {
  id: string;
  course_id: string;
  status: string;
  progress: number;
  courses: Course;
}

/* ── Course config ── */
const COURSE_CONFIG: Record<string, {
  image: string;
  icon: any;
  color: string;
  gradient: string;
  outcomes: string[];
  tools: string[];
  builds: string[];
  fullDescription: string;
}> = {
  'full-stack-development': {
    image: '/images/courses/fullstack-engineering.jpg',
    icon: Layers,
    color: 'text-brand-blue',
    gradient: 'from-brand-blue/20',
    outcomes: ['Build production SaaS products', 'Land full-stack roles', 'Launch your own startup'],
    tools: ['React', 'Next.js', 'Node.js', 'NestJS', 'PostgreSQL', 'Supabase', 'Vercel'],
    builds: ['Full-stack SaaS app', 'REST API with auth', 'Deployed production product'],
    fullDescription: 'Master modern full-stack engineering by building production-grade applications using React, Next.js, NestJS, PostgreSQL, authentication systems, and real deployment workflows used by startups and global engineering teams.',
  },
  'frontend-engineering': {
    image: '/images/courses/frontend-engineering.jpg',
    icon: Code2,
    color: 'text-cyan-400',
    gradient: 'from-cyan-600/20',
    outcomes: ['Build pixel-perfect UIs', 'Master React ecosystem', 'Ship production apps'],
    tools: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'TailwindCSS', 'Framer Motion'],
    builds: ['Animated landing pages', 'React dashboard', 'Production web app'],
    fullDescription: 'Go from zero to production-grade frontend engineer. Master React, Next.js, animations, state management, API integration, and the complete modern frontend toolchain used at top startups.',
  },
  'ui-ux-product-design': {
    image: '/images/courses/uiux-design.jpg',
    icon: Palette,
    color: 'text-purple-400',
    gradient: 'from-purple-600/20',
    outcomes: ['Design world-class products', 'Lead product design', 'Build design systems'],
    tools: ['Figma', 'FigJam', 'Prototyping', 'Design Systems', 'User Research'],
    builds: ['Complete app UI kit', 'Interactive prototype', 'Design system library'],
    fullDescription: 'Learn to design beautiful, functional products that users love. Master Figma, design systems, user research methodologies, prototyping, and handoff workflows used at product companies worldwide.',
  },
  'graphic-design-branding': {
    image: '/images/courses/branding-design.jpg',
    icon: Star,
    color: 'text-orange-400',
    gradient: 'from-orange-600/20',
    outcomes: ['Build brand identities', 'Serve global clients', 'Launch design business'],
    tools: ['Adobe Illustrator', 'Photoshop', 'Canva Pro', 'Brand Strategy'],
    builds: ['Complete brand identity', 'Social media kit', 'Client brand system'],
    fullDescription: 'Create powerful brand identities and visual systems that make businesses unforgettable. Master logo design, brand strategy, visual direction, and the complete branding workflow used by top creative agencies.',
  },
  'prompt-engineering-ai': {
    image: '/images/courses/ai-engineering.jpg',
    icon: Brain,
    color: 'text-green-400',
    gradient: 'from-green-600/20',
    outcomes: ['Build AI-powered workflows', 'Automate with AI', 'Lead AI adoption'],
    tools: ['ChatGPT', 'Claude', 'Midjourney', 'Make.com', 'Zapier', 'n8n'],
    builds: ['AI automation system', 'Custom AI workflow', 'Prompt library'],
    fullDescription: 'Learn to work with cutting-edge AI systems and build intelligent workflows that save hours of work daily. Master prompt engineering, AI tools, automation systems, and the skills that every modern builder needs.',
  },
  'video-editing-videography': {
    image: '/images/courses/video-editing.jpg',
    icon: Video,
    color: 'text-red-400',
    gradient: 'from-red-600/20',
    outcomes: ['Create viral content', 'Build media business', 'Work with brands'],
    tools: ['CapCut', 'Premiere Pro', 'DaVinci Resolve', 'After Effects basics'],
    builds: ['Brand video reel', 'Social content series', 'Professional video portfolio'],
    fullDescription: 'Create professional video content that captivates audiences and builds brands. Master video editing, color grading, storytelling, motion graphics basics, and the content strategy that grows channels and wins clients.',
  },
};

const categoryIcons: Record<string, any> = {
  development: Code2,
  design: Palette,
  ai: Brain,
  creative: Video,
};

const WHY_ITEMS = [
  { icon: Zap, title: 'Build From Day One', desc: 'Every lesson connects directly to a real project you are building.' },
  { icon: Users, title: 'Real Mentorship', desc: 'Active builders and instructors who have shipped real products.' },
  { icon: Globe, title: 'Physical + Video', desc: 'Attend in-person sessions or learn via video at your pace.' },
  { icon: Award, title: 'Ecosystem Certificate', desc: 'Earn a verifiable certificate recognized inside the TechMindsVerse ecosystem.' },
];

const OUTCOMES = [
  { stat: '6', label: 'Courses Available', color: 'text-brand-blue' },
  { stat: '50+', label: 'Students Enrolled', color: 'text-green-400' },
  { stat: '3', label: 'Cohorts Completed', color: 'text-purple-400' },
  { stat: '100%', label: 'Project-Based', color: 'text-orange-400' },
];

/* ── Course Card ── */
function CourseCard({
  course,
  enrolled,
  enrollStatus,
  index,
}: {
  course: Course;
  enrolled: boolean;
  enrollStatus?: string;
  index: number;
}) {
  const config = COURSE_CONFIG[course.slug];
  const Icon = config?.icon || BookOpen;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
      className="group relative border border-white/5 bg-black overflow-hidden hover:border-white/15 transition-all duration-500"
    >
      {/* Enrolled badge */}
      {enrolled && (
        <div className="absolute top-3 right-3 z-20">
          <span className="text-xs text-green-400 border border-green-400/25 bg-green-400/10 px-2 py-0.5 capitalize backdrop-blur-sm">
            {enrollStatus}
          </span>
        </div>
      )}

      {/* Course image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={config?.image || '/images/courses/web-development.jpg'}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-course.jpg';
          }}
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        {/* Category badge */}
        <div className="absolute bottom-3 left-4 flex items-center gap-2">
          <Icon size={14} className={config?.color || 'text-brand-blue'} />
          <span className="text-white/70 text-xs capitalize">{course.category}</span>
        </div>
        {/* Hover play overlay */}
        {enrolled && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-12 h-12 rounded-full bg-brand-blue/90 flex items-center justify-center">
              <Play size={18} className="text-white ml-0.5" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className={`text-xs capitalize font-medium ${config?.color || 'text-brand-blue'}`}>
            {course.level}
          </span>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white/40 text-xs flex items-center gap-1">
            <Clock size={10} /> {course.duration}
          </span>
          <span className="text-white/15 text-xs">·</span>
          <span className="text-white/40 text-xs flex items-center gap-1">
            <Users size={10} /> {course.instructor_name}
          </span>
        </div>

        <h3 className="font-bebas text-xl md:text-2xl text-white mb-2 leading-tight">
          {course.title}
        </h3>

        <p className="text-white/40 text-sm leading-relaxed mb-4 line-clamp-2">
          {config?.fullDescription || course.description}
        </p>

        {/* Tools */}
        {config?.tools && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {config.tools.slice(0, 4).map((tool) => (
              <span key={tool} className="text-xs text-white/25 border border-white/8 px-2 py-0.5">
                {tool}
              </span>
            ))}
            {config.tools.length > 4 && (
              <span className="text-xs text-white/20 px-1">+{config.tools.length - 4}</span>
            )}
          </div>
        )}

        {/* What you'll build */}
        {config?.builds && (
          <div className="border-t border-white/5 pt-4 mb-4">
            <p className="text-white/25 text-xs uppercase tracking-wider mb-2">You Will Build</p>
            {config.builds.slice(0, 2).map((build, i) => (
              <div key={i} className="flex items-center gap-2 text-white/45 text-xs mb-1">
                <div className="w-1 h-1 rounded-full bg-brand-blue/70 shrink-0" />
                {build}
              </div>
            ))}
          </div>
        )}

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-white/5">
          {enrolled ? (
            <Link
              href="/academy"
              className="text-brand-blue text-sm flex items-center gap-1.5 hover:gap-2 transition-all"
            >
              <Play size={12} /> Continue Learning
            </Link>
          ) : (
            <>
              <Link
                href={`/enroll?course=${encodeURIComponent(course.title)}`}
                className={`text-sm flex items-center gap-1.5 transition-all group-hover:gap-2 ${config?.color || 'text-brand-blue'}`}
              >
                Apply Now <ArrowRight size={13} />
              </Link>
              <span className="text-white/15 text-xs flex items-center gap-1">
                <Lock size={9} /> Price on request
              </span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── ACADEMY DASHBOARD (enrolled students) ── */
function AcademyDashboard({
  courses,
  enrollments,
  user,
}: {
  courses: Course[];
  enrollments: Enrollment[];
  user: any;
}) {
  const router = useRouter();
  const activeEnrollments = enrollments.filter((e) => e.status === 'active');

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/5 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-brand-blue rounded-sm flex items-center justify-center">
            <span className="font-bebas text-white text-sm">T</span>
          </div>
          <div>
            <span className="font-bebas tracking-widest text-sm text-white">ACADEMY OS</span>
            <p className="text-white/20 text-xs leading-none mt-0.5">TechMindsVerse</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-white/30 hover:text-white text-xs transition">
            ← Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Welcome */}
        <div className="mb-10">
          <p className="text-brand-blue text-xs tracking-[0.3em] uppercase mb-2">Academy OS</p>
          <h1 className="font-bebas text-3xl md:text-5xl text-white leading-none">
            WELCOME BACK
          </h1>
          <p className="text-white/30 text-sm mt-2">
            {activeEnrollments.length} active course{activeEnrollments.length !== 1 ? 's' : ''} · Keep building
          </p>
        </div>

        {/* Active courses */}
        <div className="mb-12">
          <h2 className="font-bebas text-xl text-white mb-5 flex items-center gap-2">
            <Play size={16} className="text-brand-blue" /> MY COURSES
          </h2>
          <div className="grid md:grid-cols-2 gap-5">
            {activeEnrollments.map((enrollment, i) => {
              const course = enrollment.courses;
              const config = COURSE_CONFIG[course.slug];
              const Icon = config?.icon || BookOpen;
              return (
                <motion.div
                  key={enrollment.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-brand-blue/20 bg-brand-blue/5 overflow-hidden hover:border-brand-blue/35 transition-colors group"
                >
                  <div className="relative h-36 overflow-hidden">
                    <Image
                      src={config?.image || '/images/courses/web-development.jpg'}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4">
                      <span className="text-xs text-green-400 border border-green-400/25 bg-black/50 px-2 py-0.5 backdrop-blur-sm">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bebas text-xl text-white mb-1">{course.title}</h3>
                    <p className="text-white/40 text-xs mb-4">{course.instructor_name} · {course.duration}</p>
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-white/30 mb-1.5">
                        <span>Progress</span>
                        <span>{enrollment.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-white/8 h-1.5">
                        <div
                          className="h-1.5 bg-brand-blue transition-all"
                          style={{ width: `${enrollment.progress || 0}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-white/25 text-xs">
                      {enrollment.progress === 0
                        ? 'Ready to start — contact your instructor for access details'
                        : `${enrollment.progress}% complete`}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Available courses */}
        {courses.filter((c) => !enrollments.some((e) => e.course_id === c.id)).length > 0 && (
          <div>
            <h2 className="font-bebas text-xl text-white mb-2 flex items-center gap-2">
              <BookOpen size={16} className="text-white/30" /> MORE COURSES
            </h2>
            <p className="text-white/25 text-sm mb-5">
              Want to enroll in another course? Submit an application below.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              {courses
                .filter((c) => !enrollments.some((e) => e.course_id === c.id))
                .map((course) => {
                  const config = COURSE_CONFIG[course.slug];
                  const Icon = config?.icon || BookOpen;
                  return (
                    <div key={course.id} className="border border-white/5 p-4 hover:border-white/10 transition-colors">
                      <Icon size={18} className={`${config?.color || 'text-white/30'} mb-3`} />
                      <h3 className="text-white font-medium text-sm mb-1">{course.title}</h3>
                      <p className="text-white/25 text-xs leading-relaxed mb-3 line-clamp-2">{course.description}</p>
                      <Link
                        href={`/enroll?course=${encodeURIComponent(course.title)}`}
                        className="text-brand-blue text-xs flex items-center gap-1 hover:gap-2 transition-all"
                      >
                        Apply <ArrowRight size={11} />
                      </Link>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function AcademyPage() {
  const { user } = useAuthStore();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const yHero = useTransform(scrollY, [0, 500], [0, -80]);
  const opacityHero = useTransform(scrollY, [0, 400], [1, 0.7]);

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStudent, setIsStudent] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('tmv_token');
    setIsLoggedIn(!!token);

    const load = async () => {
      try {
        const coursesRes = await api.get('/courses');
        setCourses(coursesRes.data || []);

        if (token && user?.role === 'student') {
          setIsStudent(true);
          try {
            const enrollRes = await api.get('/students/me/enrollments');
            setEnrollments(enrollRes.data || []);
          } catch { /* no enrollments yet */ }
        }
      } catch {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user]);

  const activeEnrollments = enrollments.filter((e) => e.status === 'active');
  const isEnrolled = (courseId: string) => enrollments.some((e) => e.course_id === courseId);
  const getEnrollStatus = (courseId: string) => enrollments.find((e) => e.course_id === courseId)?.status;

  // Show dashboard to enrolled students
  if (isStudent && activeEnrollments.length > 0 && !loading) {
    return <AcademyDashboard courses={courses} enrollments={enrollments} user={user} />;
  }

  return (
    <PublicLayout>

      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[90vh] flex items-center overflow-hidden pt-20">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/hero/hero-workspace.jpg"
            alt="TechMindsVerse Academy"
            fill
            className="object-cover opacity-20"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/70 to-black" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black" />
        </div>

        {/* Animated orbs */}
        <div className="absolute top-1/4 right-1/4 w-80 h-80 bg-brand-blue/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/3 w-60 h-60 bg-purple-600/8 rounded-full blur-[100px]" />

        <motion.div
          style={{ y: yHero, opacity: opacityHero }}
          className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-20"
        >
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 border border-brand-blue/30 bg-brand-blue/8 px-4 py-2 mb-8"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-brand-blue pulse-dot" />
              <span className="text-brand-blue text-xs tracking-[0.25em] uppercase">
                TechMindsVerse Academy — Phase 1
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.7 }}
              className="font-bebas text-[clamp(3rem,9vw,8rem)] leading-[0.88] text-white mb-6"
            >
              DON'T JUST LEARN.<br />
              <span className="text-brand-blue">BUILD REAL</span><br />
              PRODUCTS.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="text-white/55 text-base md:text-xl leading-relaxed mb-10 max-w-xl"
            >
              TechMindsVerse Academy is a project-first learning system.
              Every lesson is tied to something you are actively building —
              a real product, a real portfolio, a real future.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                href="/enroll"
                className="group px-7 py-4 bg-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-blue/25"
              >
                Apply for Enrollment
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
                <a href="#courses"
                className="px-7 py-4 border border-white/20 text-white hover:border-white/40 transition-all text-center"
              >
                Browse Courses
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-white/20"
        >
          <span className="text-[10px] tracking-widest uppercase">Explore</span>
          <div className="w-px h-6 bg-gradient-to-b from-white/20 to-transparent" />
        </motion.div>
      </section>

      {/* ── OUTCOMES STATS ── */}
      <section className="py-16 border-y border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {OUTCOMES.map((o, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className={`font-bebas text-4xl md:text-5xl ${o.color} mb-1`}>{o.stat}</p>
                <p className="text-white/40 text-sm">{o.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TECHMINDSVERSE ── */}
      <section className="py-20 md:py-28 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-6">
                Why Us
              </span>
              <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-white leading-none mb-6">
                TRAINING BUILT FOR<br />
                <span className="text-brand-blue">THE REAL WORLD</span>
              </h2>
              <p className="text-white/40 text-base leading-relaxed mb-8">
                Most learning platforms give you theory, videos, and certificates
                that don't open doors. We give you real products in your portfolio,
                real skills in your hands, and real connections in your network.
              </p>
              <Link
                href="/enroll"
                className="inline-flex items-center gap-2 text-brand-blue text-sm hover:gap-3 transition-all"
              >
                Start your journey <ArrowRight size={14} />
              </Link>
            </motion.div>

            <div className="grid grid-cols-2 gap-4">
              {WHY_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="border border-white/5 p-5 hover:border-brand-blue/25 transition-colors group"
                >
                  <item.icon size={20} className="text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
                  <h3 className="text-white font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="py-20 md:py-28 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-12 md:mb-16"
          >
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-4">
              Courses
            </span>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
              <h2 className="font-bebas text-[clamp(2rem,5vw,4.5rem)] text-white leading-none">
                CHOOSE YOUR<br />
                <span className="text-brand-blue">LEARNING PATH</span>
              </h2>
              <p className="text-white/30 text-sm max-w-xs leading-relaxed">
                All courses include mentorship, real projects, and ecosystem certification.
                Pricing is shared after your application.
              </p>
            </div>
          </motion.div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="border border-white/5 overflow-hidden animate-pulse">
                  <div className="h-44 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                    <div className="h-5 bg-white/8 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {courses.map((course, i) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  enrolled={isEnrolled(course.id)}
                  enrollStatus={getEnrollStatus(course.id)}
                  index={i}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── ENROLLMENT PROCESS ── */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-4">
              Enrollment
            </span>
            <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-white">
              HOW TO JOIN<br /><span className="text-brand-blue">THE ACADEMY</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { step: '01', title: 'Apply for Enrollment', desc: 'Fill in our enrollment form with your course interest, goals, and contact details. No commitment required.' },
              { step: '02', title: 'Team Contacts You', desc: 'Our team reaches out within 24 hours with course details, payment information, and start dates.' },
              { step: '03', title: 'Complete Payment', desc: 'Secure your spot with payment via bank transfer or crypto. Upload your payment proof through your dashboard.' },
              { step: '04', title: 'Get Activated', desc: 'Admin approves your payment and sends your activation email. Set your password and your academy unlocks immediately.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="border border-white/5 p-6 flex gap-5 hover:border-white/10 transition-colors"
              >
                <span className="font-bebas text-4xl text-brand-blue/25 shrink-0 leading-none">{item.step}</span>
                <div>
                  <h3 className="font-bebas text-lg text-white mb-1.5">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 sm:px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue/8 via-transparent to-purple-500/8" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-blue/40 to-transparent" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <h2 className="font-bebas text-[clamp(2.5rem,7vw,6rem)] text-white leading-none mb-5">
            READY TO START<br />
            <span className="text-brand-blue">BUILDING?</span>
          </h2>
          <p className="text-white/40 mb-10 leading-relaxed text-sm md:text-base">
            Join TechMindsVerse Academy. Learn real skills.
            Build real products. Grow inside a real ecosystem.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/enroll"
              className="group px-8 py-4 bg-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
            >
              Apply Now <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/contact" className="px-8 py-4 border border-white/20 text-white hover:border-white/40 transition-all text-center">
              Ask a Question
            </Link>
          </div>
          <p className="text-white/15 text-xs mt-5">
            No price shown publicly · Contact us for details · Limited spots per cohort
          </p>
        </motion.div>
      </section>

    </PublicLayout>
  );
}