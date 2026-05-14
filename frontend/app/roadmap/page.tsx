import PublicLayout from '@/app/components/layout/PublicLayout';
import { CheckCircle, Clock, Zap } from 'lucide-react';

const phases = [
  {
    phase: 'Phase 1',
    title: 'Foundation',
    status: 'active',
    description: 'Core platform launch — academy, build studio, and admin system.',
    items: [
      { label: 'Academy enrollment system', done: true },
      { label: 'Build Studio submission system', done: true },
      { label: 'Admin control panel', done: true },
      { label: 'Payment verification system', done: true },
      { label: 'Student dashboard', done: true },
      { label: 'Email notification system', done: true },
      { label: 'PWA support', done: false },
      { label: 'Full mobile optimization', done: false },
    ],
  },
  {
    phase: 'Phase 2',
    title: 'Intelligence',
    status: 'upcoming',
    description: 'Performance tracking, analytics, and automated systems.',
    items: [
      { label: 'Student performance scoring', done: false },
      { label: 'Leaderboard & ranking system', done: false },
      { label: 'Analytics dashboard', done: false },
      { label: 'Automated notifications', done: false },
      { label: 'Blog & content system', done: false },
      { label: 'Help & documentation center', done: false },
      { label: 'Course progress tracking', done: false },
      { label: 'Certificate generation', done: false },
    ],
  },
  {
    phase: 'Phase 3',
    title: 'Automation & Scale',
    status: 'future',
    description: 'AI agents, automation workflows, and ecosystem expansion.',
    items: [
      { label: 'AI support assistant', done: false },
      { label: 'Automated build estimation', done: false },
      { label: 'Student performance agents', done: false },
      { label: 'React Native mobile app', done: false },
      { label: 'Hiring marketplace', done: false },
      { label: 'Product launch system', done: false },
      { label: 'Tech feed & community', done: false },
      { label: 'Affiliate & monetization system', done: false },
    ],
  },
];

const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
  active: { label: 'In Progress', color: 'text-green-400 border-green-400/20 bg-green-400/10', icon: Zap },
  upcoming: { label: 'Coming Soon', color: 'text-brand-blue border-brand-blue/20 bg-brand-blue/10', icon: Clock },
  future: { label: 'Planned', color: 'text-white/40 border-white/10 bg-transparent', icon: Clock },
};

export default function RoadmapPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Vision</span>
          <h1 className="font-bebas text-6xl md:text-8xl text-white mt-2 mb-4 leading-none">
            PLATFORM
            <br />
            <span className="text-brand-blue">ROADMAP</span>
          </h1>
          <p className="text-white/40 mb-16 max-w-xl leading-relaxed">
            TechMindsVerse is evolving from a platform into a full digital operating system.
            Here is where we are and where we are going.
          </p>

          <div className="space-y-12">
            {phases.map((phase, i) => {
              const config = statusConfig[phase.status];
              const Icon = config.icon;
              return (
                <div
                  key={i}
                  className={`border p-8 ${
                    phase.status === 'active'
                      ? 'border-brand-blue/30 bg-brand-blue/5'
                      : 'border-white/5'
                  }`}
                >
                  <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                    <div>
                      <span className="text-white/30 text-xs uppercase tracking-widest">{phase.phase}</span>
                      <h2 className="font-bebas text-4xl text-white mt-1">{phase.title}</h2>
                      <p className="text-white/40 text-sm mt-1">{phase.description}</p>
                    </div>
                    <span className={`flex items-center gap-1.5 text-xs border px-3 py-1 ${config.color}`}>
                      <Icon size={11} />
                      {config.label}
                    </span>
                  </div>

                  <div className="grid md:grid-cols-2 gap-2">
                    {phase.items.map((item, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm">
                        <CheckCircle
                          size={13}
                          className={item.done ? 'text-green-400' : 'text-white/10'}
                        />
                        <span className={item.done ? 'text-white/60' : 'text-white/25'}>
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}