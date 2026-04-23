import PublicLayout from '@/app/components/layout/PublicLayout';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Who We Are</span>
          <h1 className="font-bebas text-6xl md:text-9xl text-white mt-2 leading-none mb-16">
            ABOUT
            <br />
            <span className="text-brand-blue">TECHMINDSVERSE</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-16 mb-24">
            <div>
              <h2 className="font-bebas text-3xl text-white mb-4">THE VISION</h2>
              <p className="text-white/50 leading-relaxed">
                TechMindsVerse is not just a platform — it is a tech ecosystem built to transform ideas into real digital products. We combine training, product building, and digital services into one unified system designed for execution.
              </p>
            </div>
            <div>
              <h2 className="font-bebas text-3xl text-white mb-4">THE MISSION</h2>
              <p className="text-white/50 leading-relaxed">
                To build systems that help individuals and businesses scale, automate, and monetize their digital presence globally — starting from Owerri, Nigeria, reaching the world.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-24">
            {[
              { title: 'Academy', desc: 'Training the next generation of builders through project-based learning.' },
              { title: 'Build Studio', desc: 'Turning client ideas into production-ready digital products.' },
              { title: 'Products', desc: 'Building our own scalable digital products starting with P2P Pay.' },
            ].map((item, i) => (
              <div key={i} className="border border-white/10 p-8 hover:border-brand-blue/30 transition-colors">
                <h3 className="font-bebas text-2xl text-white mb-3">{item.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-16">
            <h2 className="font-bebas text-3xl text-white mb-4">WHERE WE ARE GOING</h2>
            <p className="text-white/50 max-w-3xl leading-relaxed mb-8">
              Phase 1 is about building the foundation — a stable backend, a clean frontend, and real products that work. Phase 2 introduces intelligence. Phase 3 scales into separate product ecosystems. One backend. Multiple frontiers.
            </p>
            <Link href="/build" className="inline-flex items-center gap-2 text-brand-blue hover:gap-3 transition-all text-sm">
              Start Building With Us <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}