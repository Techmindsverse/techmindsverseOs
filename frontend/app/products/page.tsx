'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import PublicLayout from '@/app/components/layout/PublicLayout';
import { ArrowRight, Shield, Zap, Globe, Lock, ExternalLink, Code2 } from 'lucide-react';

const products = [
  {
    id: 'p2p-pay',
    name: 'P2P Pay',
    tagline: 'Peer-to-Peer Crypto Exchange',
    description: 'A secure, escrow-based crypto trading platform built for the African market. Trade peer-to-peer with confidence — every transaction is protected.',
    status: 'In Development',
    statusColor: 'text-yellow-400 border-yellow-400/20 bg-yellow-400/10',
    category: 'Fintech',
    team: 'TechMindsVerse',
    features: [
      { icon: Shield, text: 'Escrow-protected transactions' },
      { icon: Globe, text: 'Multi-currency support' },
      { icon: Zap, text: 'Fast peer-to-peer matching' },
      { icon: Lock, text: 'Non-custodial architecture' },
    ],
    tech: ['React', 'NestJS', 'Supabase', 'Blockchain', 'PostgreSQL'],
    gradient: 'from-brand-blue/20 via-purple-600/10 to-transparent',
    accent: 'border-brand-blue/30',
    featured: true,
  },
];

export default function ProductsPage() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="pt-28 md:pt-36 pb-16 px-4 sm:px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-purple-600/8 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-6">
              Products
            </span>
            <h1 className="font-bebas text-[clamp(2.5rem,8vw,7rem)] leading-none text-white mb-4">
              BUILT BY<br />
              <span className="text-brand-blue">TECHMINDSVERSE.</span>
            </h1>
            <p className="text-white/40 text-base md:text-lg max-w-xl leading-relaxed">
              We don't just teach and build for clients. We build our own products.
              Real tools, solving real problems.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`relative border ${product.accent} overflow-hidden mb-8`}
            >
              {/* Gradient bg */}
              <div className={`absolute inset-0 bg-gradient-to-br ${product.gradient} pointer-events-none`} />

              <div className="relative p-6 md:p-10">
                {product.featured && (
                  <div className="flex items-center gap-2 mb-6">
                    <span className="text-xs text-brand-blue border border-brand-blue/30 bg-brand-blue/10 px-2 py-0.5">
                      {product.category}
                    </span>
                    <span className={`text-xs border px-2 py-0.5 ${product.statusColor}`}>
                      {product.status}
                    </span>
                    <span className="text-xs text-white/20 border border-white/10 px-2 py-0.5">
                      By {product.team}
                    </span>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
                  <div>
                    <h2 className="font-bebas text-[clamp(2.5rem,6vw,5rem)] text-white leading-none mb-2">
                      {product.name}
                    </h2>
                    <p className="text-brand-blue text-sm mb-4">{product.tagline}</p>
                    <p className="text-white/50 leading-relaxed mb-6 text-sm md:text-base">
                      {product.description}
                    </p>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {product.tech.map((t, j) => (
                        <span key={j} className="text-xs text-white/30 border border-white/10 px-2 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <span className="flex items-center gap-2 text-white/30 text-sm border border-white/10 px-4 py-2">
                        <Code2 size={14} /> Under Development
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-bebas text-lg text-white mb-4">KEY FEATURES</h3>
                    {product.features.map((f, j) => (
                      <motion.div
                        key={j}
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: j * 0.08 }}
                        className="flex items-center gap-3 border border-white/5 p-3 hover:border-white/10 transition-colors"
                      >
                        <f.icon size={16} className="text-brand-blue shrink-0" />
                        <span className="text-white/60 text-sm">{f.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* COMING SOON */}
      <section className="py-16 px-4 sm:px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-bebas text-2xl text-white mb-2">MORE PRODUCTS COMING</h2>
          <p className="text-white/30 text-sm mb-8">
            TechMindsVerse is a product company. More tools, platforms, and systems are in the pipeline.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['AI Productivity Tool', 'Developer Marketplace', 'Academy Platform', 'Analytics OS'].map((name, i) => (
              <div key={i} className="border border-white/5 border-dashed p-5 text-center">
                <p className="text-white/20 text-sm font-medium">{name}</p>
                <p className="text-white/10 text-xs mt-1">Coming soon</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 border-t border-white/5 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-xl mx-auto">
          <h2 className="font-bebas text-[clamp(2rem,5vw,4rem)] text-white leading-none mb-4">
            WANT TO BUILD<br /><span className="text-brand-blue">YOUR OWN PRODUCT?</span>
          </h2>
          <p className="text-white/40 text-sm mb-6">
            Use our Build Studio. We help founders and startups turn ideas into real products.
          </p>
          <Link href="/build" className="inline-flex items-center gap-2 bg-brand-blue text-white px-7 py-4 font-semibold hover:bg-blue-700 transition">
            Submit Build Request <ArrowRight size={16} />
          </Link>
        </motion.div>
      </section>

    </PublicLayout>
  );
}