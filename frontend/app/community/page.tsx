'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PublicLayout from '@/app/components/layout/PublicLayout';
import api from '@/app/lib/api';
import {
  Users, Zap, Globe, BookOpen, Package,
  Bell, ArrowRight, Activity, Star, Calendar
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
  launch:      { color: 'text-green-400',  bg: 'bg-green-400/10',  border: 'border-green-400/20' },
  event:       { color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  academy:     { color: 'text-brand-blue', bg: 'bg-brand-blue/10', border: 'border-brand-blue/20' },
  opportunity: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  hackathon:   { color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
  community:   { color: 'text-cyan-400',   bg: 'bg-cyan-400/10',   border: 'border-cyan-400/20' },
  achievement: { color: 'text-gold-400',   bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  update:      { color: 'text-white/60',   bg: 'bg-white/5',       border: 'border-white/10' },
};

const ECOSYSTEM_MODULES = [
  { icon: BookOpen, label: 'Academy', desc: 'Learn by building real products', href: '/academy' },
  { icon: Package, label: 'Build Studio', desc: 'Turn ideas into products', href: '/build' },
  { icon: Globe, label: 'Ecosystem', desc: 'One account, all modules', href: '/register' },
];

const WHAT_YOU_GET = [
  { icon: Bell, title: 'Ecosystem Updates', desc: 'First to know about launches, events, and opportunities inside TechMindsVerse.' },
  { icon: Users, title: 'Builder Network', desc: 'Connect with developers, designers, and founders building real products.' },
  { icon: BookOpen, title: 'Learning Resources', desc: 'Access course announcements, learning paths, and practical resources.' },
  { icon: Zap, title: 'Opportunities', desc: 'Gigs, job boards, collaborations, and hackathons — all inside the ecosystem.' },
];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');

  useEffect(() => {
    const load = async () => {
      try {
        const [postsRes, statsRes] = await Promise.allSettled([
          api.get('/public/community-posts?limit=20'),
          api.get('/public/stats'),
        ]);

        if (postsRes.status === 'fulfilled') {
          setPosts(postsRes.value.data || []);
        }
        if (statsRes.status === 'fulfilled') {
          setStats(statsRes.value.data);
        }
      } catch {
        // fail silently
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filters = ['all', 'launch', 'academy', 'event', 'opportunity', 'community'];

  const filteredPosts = activeFilter === 'all'
    ? posts
    : posts.filter(p => p.type === activeFilter);

  const pinnedPosts = filteredPosts.filter(p => p.pinned);
  const regularPosts = filteredPosts.filter(p => !p.pinned);

  return (
    <PublicLayout>

      {/* HERO */}
      <section className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 relative overflow-hidden section-isolated">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-brand-blue/8 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-purple-600/6 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-6">
              Community
            </span>
            <h1 className="font-bebas text-[clamp(2.5rem,8vw,7rem)] leading-none text-white mb-4">
              BUILD WITH US.<br />
              <span className="text-brand-blue">GROW TOGETHER.</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed mb-8">
              TechMindsVerse Community is where builders, students, designers, and founders
              connect, collaborate, and ship real products together.
            </p>

            {/* Stats */}
            {stats && (
              <div className="flex flex-wrap gap-6 mb-8">
                {[
                  { label: 'Members', value: `${stats.active_users || 50}+` },
                  { label: 'Students', value: `${stats.total_students || 20}+` },
                  { label: 'Builds', value: `${stats.total_builds || 10}+` },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="font-bebas text-2xl text-brand-blue">{s.value}</span>
                    <span className="text-white/30 text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="group px-7 py-4 bg-brand-blue text-white font-semibold flex items-center justify-center gap-2 hover:bg-blue-700 transition-all"
              >
                Join the Ecosystem <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="px-7 py-4 border border-white/20 text-white hover:border-white/40 transition text-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ECOSYSTEM MODULES */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5 section-isolated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-bebas text-3xl md:text-4xl text-white">
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
                className="border border-white/5 p-5 hover:border-brand-blue/30 transition-colors group"
              >
                <mod.icon size={20} className="text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-sm mb-1">{mod.label}</h3>
                <p className="text-white/35 text-xs leading-relaxed">{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* LIVE UPDATES FEED */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5 section-isolated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-3">
                  Live Feed
                </span>
                <h2 className="font-bebas text-3xl md:text-4xl text-white">ECOSYSTEM UPDATES</h2>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400 pulse-dot" />
                <span className="text-white/30 text-xs">Live</span>
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
                      ? 'bg-brand-blue text-white'
                      : 'border border-white/10 text-white/40 hover:border-white/25 hover:text-white'
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
                <div key={i} className="border border-white/5 p-5 animate-pulse">
                  <div className="h-3 bg-white/5 rounded w-20 mb-3" />
                  <div className="h-4 bg-white/8 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="border border-white/5 p-12 text-center">
              <Activity size={32} className="text-white/10 mx-auto mb-3" />
              <p className="text-white/30 text-sm">No posts in this category yet.</p>
              <p className="text-white/20 text-xs mt-1">Check back soon — the ecosystem is growing.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Pinned posts */}
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
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className={`text-xs ${config.color} border ${config.border} ${config.bg} px-2 py-0.5 capitalize`}>
                            {post.type}
                          </span>
                          <span className="text-white/20 text-xs">📌 Pinned</span>
                        </div>
                        <h3 className="text-white font-semibold text-sm mb-1.5">{post.title}</h3>
                        <p className="text-white/45 text-sm leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                    <p className="text-white/20 text-xs mt-3">
                      {new Date(post.created_at).toLocaleDateString('en-NG', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </motion.div>
                );
              })}

              {/* Regular posts */}
              {regularPosts.map((post, i) => {
                const config = typeConfig[post.type] || typeConfig.update;
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06 }}
                    className="border border-white/5 p-5 hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`w-1 h-full min-h-[40px] ${config.bg} rounded-full shrink-0 self-stretch`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`text-xs ${config.color} capitalize`}>{post.type}</span>
                          <span className="text-white/15 text-xs">·</span>
                          <span className="text-white/20 text-xs">
                            {new Date(post.created_at).toLocaleDateString('en-NG', {
                              day: 'numeric', month: 'short'
                            })}
                          </span>
                        </div>
                        <h3 className="text-white text-sm font-medium mb-1">{post.title}</h3>
                        <p className="text-white/40 text-sm leading-relaxed">{post.content}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5 section-isolated">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-bebas text-3xl md:text-4xl text-white">
              COMMUNITY BENEFITS
            </h2>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-4">
            {WHAT_YOU_GET.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="border border-white/5 p-6 flex gap-4 hover:border-white/10 transition-colors"
              >
                <div className="w-10 h-10 bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-brand-blue" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm mb-1.5">{item.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5 text-center section-isolated">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-xl mx-auto"
        >
          <h2 className="font-bebas text-[clamp(2rem,6vw,5rem)] text-white leading-none mb-4">
            JOIN THE<br /><span className="text-brand-blue">ECOSYSTEM TODAY</span>
          </h2>
          <p className="text-white/40 mb-8 text-sm leading-relaxed">
            One account. Every module. Academy, Build Studio, Community — all connected.
            Free to join.
          </p>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 px-8 py-4 bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-all"
          >
            Create Free Account <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <p className="text-white/15 text-xs mt-4">No credit card · Instant access · Free forever</p>
        </motion.div>
      </section>

    </PublicLayout>
  );
}