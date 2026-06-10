'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/api';
import {
  Users, Zap, Globe, BookOpen, Package,
  Bell, ArrowRight, Activity,
} from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  type: string;
  pinned: boolean;
  view_count: number;
  created_at: string;
}

interface PlatformStats {
  active_users: number;
  total_students: number;
  total_builds: number;
  completed_builds: number;
}

const typeConfig: Record<string, { color: string; bg: string; border: string }> = {
  launch:      { color: 'text-green-500',  bg: 'bg-green-50  dark:bg-green-400/10',  border: 'border-green-200  dark:border-green-400/20' },
  event:       { color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-400/10', border: 'border-purple-200 dark:border-purple-400/20' },
  academy:     { color: 'text-[#1A3BDB]',  bg: 'bg-blue-50   dark:bg-blue-400/10',   border: 'border-blue-200   dark:border-[#1A3BDB]/20' },
  opportunity: { color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-400/10', border: 'border-yellow-200 dark:border-yellow-400/20' },
  hackathon:   { color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-400/10', border: 'border-orange-200 dark:border-orange-400/20' },
  community:   { color: 'text-cyan-600',   bg: 'bg-cyan-50   dark:bg-cyan-400/10',   border: 'border-cyan-200   dark:border-cyan-400/20' },
  update:      { color: 'text-secondary',  bg: 'bg-muted',                           border: 'border-surface' },
};

const ECOSYSTEM_MODULES = [
  { icon: BookOpen, label: 'Academy',      desc: 'Learn by building real products',  href: '/academy' },
  { icon: Package,  label: 'Build Studio', desc: 'Turn ideas into products',         href: '/build' },
  { icon: Globe,    label: 'Ecosystem',    desc: 'One account, all modules',         href: '/register' },
];

const WHAT_YOU_GET = [
  { icon: Bell,     title: 'Ecosystem Updates', desc: 'First to know about launches, events, and opportunities inside TechMindsVerse.' },
  { icon: Users,    title: 'Builder Network',   desc: 'Connect with developers, designers, and founders building real products.' },
  { icon: BookOpen, title: 'Learning Resources',desc: 'Access course announcements, learning paths, and practical resources.' },
  { icon: Zap,      title: 'Opportunities',     desc: 'Gigs, job boards, collaborations, and hackathons — all inside the ecosystem.' },
];

export default function CommunityPage() {
  const [posts, setPosts]             = useState<Post[]>([]);
  const [stats, setStats]             = useState<PlatformStats | null>(null);
  const [loading, setLoading]         = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    Promise.allSettled([
      api.get('/public/community-posts?limit=20'),
      api.get('/public/stats'),
    ]).then(([postsRes, statsRes]) => {
      if (postsRes.status === 'fulfilled') setPosts(postsRes.value.data || []);
      if (statsRes.status === 'fulfilled') setStats(statsRes.value.data);
    }).finally(() => setLoading(false));
  }, []);

  const filters = ['all', 'launch', 'academy', 'event', 'opportunity', 'community'];
  const filteredPosts = activeFilter === 'all' ? posts : posts.filter(p => p.type === activeFilter);
  const pinnedPosts   = filteredPosts.filter(p => p.pinned);
  const regularPosts  = filteredPosts.filter(p => !p.pinned);

  return (
    <PublicLayout>

      {/* ── HERO — always dark ── */}
      <section className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 relative overflow-hidden section-isolated hero-dark">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#1A3BDB]/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-600/6 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/30 bg-[#1A3BDB]/8 px-4 py-1.5 inline-block mb-6">
              Community
            </span>
            <h1 className="font-bebas text-[clamp(2.5rem,8vw,7rem)] leading-none text-white mb-4">
              BUILD WITH US.<br />
              <span className="text-[#1A3BDB]">GROW TOGETHER.</span>
            </h1>
            <p className="text-white/50 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              TechMindsVerse Community is where builders, students, designers, and founders
              connect, collaborate, and ship real products together.
            </p>

            {stats && (
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { label: 'Members',  value: `${stats.active_users || 0}+` },
                  { label: 'Students', value: `${stats.total_students || 0}+` },
                  { label: 'Builds',   value: `${stats.total_builds || 0}+` },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-[#1A3BDB]">{s.value}</span>
                    <span className="text-white/40 text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/register" className="group px-7 py-4 bg-[#1A3BDB] text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all">
                Join the Ecosystem <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/login" className="px-7 py-4 border border-white/20 text-white hover:border-white/40 transition text-center">
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── ECOSYSTEM MODULES ── */}
      <section className="py-16 px-4 sm:px-6 border-t border-surface section-isolated pub-section-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary">
              WHAT YOU UNLOCK AS A MEMBER
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-4">
            {ECOSYSTEM_MODULES.map((mod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="pub-card border p-5 group"
              >
                <mod.icon size={20} className="text-[#1A3BDB] mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-primary font-semibold text-sm mb-1">{mod.label}</h3>
                <p className="text-secondary text-xs leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE UPDATES FEED ── */}
      <section className="py-16 px-4 sm:px-6 border-t border-surface section-isolated pub-section">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-[#1A3BDB] text-xs tracking-[0.3em] uppercase border border-[#1A3BDB]/25 bg-[#1A3BDB]/8 px-4 py-1.5 inline-block mb-3">
                  Live Feed
                </span>
                <h2 className="font-bebas text-3xl md:text-4xl text-primary">ECOSYSTEM UPDATES</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 pulse-dot" />
                <span className="text-secondary text-xs">Live</span>
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex flex-wrap gap-2 mt-5">
              {filters.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`text-xs px-3 py-1.5 capitalize transition-all ${
                    activeFilter === f
                      ? 'bg-[#1A3BDB] text-white'
                      : 'border border-surface text-secondary hover:border-[#1A3BDB]/30 hover:text-primary'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </motion.div>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="pub-card border p-5 animate-pulse">
                  <div className="h-3 bg-muted rounded w-20 mb-3" />
                  <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                  <div className="h-3 bg-muted rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="pub-card border p-12 text-center">
              <Activity size={32} className="text-secondary mx-auto mb-3 opacity-30" />
              <p className="text-secondary text-sm">No posts in this category yet.</p>
              <p className="text-muted text-xs mt-1">Check back soon — the ecosystem is growing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pinnedPosts.map((post, i) => {
                const config = typeConfig[post.type] || typeConfig.update;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className={`border ${config.border} ${config.bg} p-5 relative`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs ${config.color} border ${config.border} ${config.bg} px-2 py-0.5 capitalize`}>
                        {post.type}
                      </span>
                      <span className="text-secondary text-xs">📌 Pinned</span>
                    </div>
                    <h3 className="text-primary font-semibold text-sm mb-1.5">{post.title}</h3>
                    <p className="text-secondary text-sm leading-relaxed">{post.content}</p>
                    <p className="text-muted text-xs mt-3">
                      {new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </motion.div>
                );
              })}

              {regularPosts.map((post, i) => {
                const config = typeConfig[post.type] || typeConfig.update;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="pub-card border p-5"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-1 min-h-[40px] ${config.bg} rounded-full shrink-0 self-stretch`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs ${config.color} capitalize`}>{post.type}</span>
                          <span className="text-muted text-xs">·</span>
                          <span className="text-muted text-xs">
                            {new Date(post.created_at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                          </span>
                        </div>
                        <h3 className="text-primary text-sm font-medium mb-1">{post.title}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-16 px-4 sm:px-6 border-t border-surface section-isolated pub-section-alt">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="font-bebas text-3xl md:text-4xl text-primary">COMMUNITY BENEFITS</h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="pub-card border p-6 flex gap-4"
              >
                <div className="w-10 h-10 bg-[#1A3BDB]/10 border border-[#1A3BDB]/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[#1A3BDB]" />
                </div>
                <div>
                  <h3 className="text-primary font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 sm:px-6 border-t border-surface text-center section-isolated pub-section">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
          <h2 className="font-bebas text-[clamp(2rem,6vw,5rem)] text-primary leading-none mb-4">
            JOIN THE<br /><span className="text-[#1A3BDB]">ECOSYSTEM TODAY</span>
          </h2>
          <p className="text-secondary mb-8 text-sm leading-relaxed">
            One account. Every module. Academy, Build Studio, Community — all connected. Free to join.
          </p>
          <Link href="/register" className="group inline-flex items-center gap-2 px-8 py-4 bg-[#1A3BDB] text-white font-semibold hover:bg-blue-700 transition-all">
            Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-muted text-xs mt-4">No credit card · Instant access · Free forever</p>
        </motion.div>
      </section>

    </PublicLayout>
  );
}