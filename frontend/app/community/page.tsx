'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PublicLayout from '@/app/components/layout/PublicLayout';
import {
  Users, MessageSquare, Zap, Globe,
  ArrowRight, Star, Trophy, BookOpen
} from 'lucide-react';

const announcements = [
  { type: 'Launch', title: 'TechMindsVerse OS Phase 1 is Live', desc: 'Academy, Build Studio, and Admin OS are now fully operational.', date: 'May 2026', badge: 'bg-brand-blue/20 text-brand-blue border-brand-blue/30' },
  { type: 'Academy', title: 'Full-Stack Development Cohort Open', desc: 'Applications are now open for the next cohort. Limited spots available.', date: 'May 2026', badge: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
  { type: 'Community', title: 'WhatsApp Community Now Active', desc: 'Join 50+ members already building, learning, and collaborating.', date: 'April 2026', badge: 'bg-green-500/20 text-green-400 border-green-500/30' },
];

const highlights = [
  { name: 'Vera Chinecherem', role: 'Student', achievement: 'Completed Full-Stack track', avatar: 'V' },
  { name: 'Kenlight', role: 'Client', achievement: 'Launched portfolio product', avatar: 'K' },
  { name: 'Stanley', role: 'Student', achievement: 'Submitted 3 projects', avatar: 'S' },
];

const communityValues = [
  { icon: Zap, title: 'Build in Public', desc: 'Share your progress, get feedback, grow faster.' },
  { icon: Users, title: 'Collaborate', desc: 'Find teammates, cofounders, and mentors.' },
  { icon: Trophy, title: 'Get Recognized', desc: 'Top builders get featured and referred to opportunities.' },
  { icon: Globe, title: 'Go Global', desc: 'Network beyond borders, build for the world.' },
];

const phases = [
  { phase: 'Now', title: 'WhatsApp Community', desc: 'Active group for builders and students.', status: 'live', href: 'https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH' },
  { phase: 'Phase 2', title: 'Community Feed', desc: 'Posts, reactions, comments inside the platform.', status: 'soon' },
  { phase: 'Phase 2', title: 'Public Profiles', desc: 'Shareable builder identity at /u/username.', status: 'soon' },
  { phase: 'Phase 3', title: 'Leaderboard', desc: 'Rankings, XP system, badges, and achievements.', status: 'planned' },
  { phase: 'Phase 3', title: 'Collaboration Tools', desc: 'Team formation, project rooms, DMs.', status: 'planned' },
];

export default function CommunityPage() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="pt-32 pb-16 px-4 sm:px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-brand-blue/8 rounded-full blur-[100px]" />
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-6">Community</span>
          <h1 className="font-bebas text-[clamp(3rem,8vw,7rem)] leading-none text-white mb-4">
            BUILD TOGETHER.<br /><span className="text-brand-blue">GROW TOGETHER.</span>
          </h1>
          <p className="text-white/40 text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            A living ecosystem of builders, learners, and founders. Connected, collaborative, and growing every day.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            
             <a href="https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-7 py-4 bg-green-500 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-600 transition-all"
            >
              Join WhatsApp Community <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
            <Link href="/register" className="px-7 py-4 border border-white/20 text-white hover:border-brand-blue/50 hover:bg-brand-blue/5 transition-all text-center">
              Create Ecosystem Account
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ANNOUNCEMENTS */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-3">Ecosystem Updates</span>
            <h2 className="font-bebas text-4xl md:text-5xl text-white">ANNOUNCEMENTS</h2>
          </motion.div>
          <div className="space-y-4">
            {announcements.map((a, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-white/5 p-5 md:p-6 hover:border-white/10 transition-colors flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs border px-2 py-0.5 ${a.badge}`}>{a.type}</span>
                    <span className="text-white/20 text-xs">{a.date}</span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{a.title}</h3>
                  <p className="text-white/40 text-sm leading-relaxed">{a.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMUNITY VALUES */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-white">
              HOW WE BUILD<br /><span className="text-brand-blue">TOGETHER</span>
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {communityValues.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-white/5 p-5 hover:border-brand-blue/30 transition-colors group">
                <v.icon size={22} className="text-brand-blue mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-white font-semibold text-sm mb-1">{v.title}</h3>
                <p className="text-white/30 text-xs leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* MEMBER HIGHLIGHTS */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-3">Spotlight</span>
            <h2 className="font-bebas text-4xl md:text-5xl text-white">MEMBER HIGHLIGHTS</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {highlights.map((h, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="border border-white/5 p-6 hover:border-white/10 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/15 border border-brand-blue/25 rounded-full flex items-center justify-center">
                    <span className="font-bebas text-brand-blue text-lg">{h.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{h.name}</p>
                    <p className="text-white/30 text-xs">{h.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star size={12} className="text-brand-blue fill-brand-blue" />
                  <p className="text-white/50 text-xs">{h.achievement}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-3">Roadmap</span>
            <h2 className="font-bebas text-4xl md:text-5xl text-white">COMMUNITY EVOLUTION</h2>
          </motion.div>
          <div className="space-y-4">
            {phases.map((p, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className={`border p-5 flex items-center gap-5 ${p.status === 'live' ? 'border-green-500/20 bg-green-500/5' : 'border-white/5'}`}>
                <div className="shrink-0">
                  <span className={`text-xs border px-2 py-0.5 ${
                    p.status === 'live' ? 'text-green-400 border-green-400/20' :
                    p.status === 'soon' ? 'text-brand-blue border-brand-blue/20' :
                    'text-white/30 border-white/10'
                  }`}>{p.phase}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{p.title}</p>
                  <p className="text-white/40 text-xs mt-0.5">{p.desc}</p>
                </div>
                {p.status === 'live' && p.href && (
                  <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-green-400 text-xs hover:underline shrink-0">
                    Join →
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 sm:px-6 border-t border-white/5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
          <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] text-white mb-4">
            READY TO JOIN?<br /><span className="text-brand-blue">WE'RE WAITING.</span>
          </h2>
          <p className="text-white/40 mb-8 leading-relaxed">Start as a visitor. Grow into a builder. Become part of the ecosystem.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a href="https://chat.whatsapp.com/GaIXQOrgY8W4VYAYYUsApH" target="_blank" rel="noopener noreferrer" className="px-7 py-4 bg-green-500 text-white font-semibold hover:bg-green-600 transition-all text-center">
              Join WhatsApp Now
            </a>
            <Link href="/register" className="px-7 py-4 bg-brand-blue text-white font-semibold hover:bg-blue-700 transition-all text-center">
              Create Free Account
            </Link>
          </div>
        </motion.div>
      </section>

    </PublicLayout>
  );
}