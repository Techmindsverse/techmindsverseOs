'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers, Code2, Zap, CheckCircle,
  ArrowRight, Users, Rocket, MessageSquare
} from 'lucide-react';
import PublicLayout from '@/app/components/layout/PublicLayout';

const services = [
  {
    icon: Layers,
    title: 'Branding OS Package',
    tag: 'Brand Identity',
    description: 'Full identity system for startups and businesses ready to dominate their market.',
    price: { usd: 250, ngn: 350000, usdt: 250 },
    features: [
      'Logo & Brand Identity System',
      'Brand Strategy & Positioning',
      'Social Media Setup',
      'Visual Direction Kit',
      'Launch Branding Package',
    ],
  },
  {
    icon: Users,
    title: 'Social Media Management',
    tag: 'Growth System',
    description: 'We fully manage your digital presence and growth across all platforms.',
    price: { usd: 300, ngn: 450000, usdt: 300 },
    features: [
      'Content Creation & Posting',
      'Page Management',
      'Growth Strategy',
      'Analytics & Reporting',
      'Community Engagement',
    ],
  },
  {
    icon: Code2,
    title: 'Product & Web Development',
    tag: 'Development',
    description: 'We design and build scalable systems, platforms, and SaaS products.',
    price: { usd: 500, ngn: 800000, usdt: 500 },
    features: [
      'Landing Pages & Web Apps',
      'Full-Stack Development',
      'Admin Dashboards',
      'API Integration',
      'Deployment & Support',
    ],
  },
  {
    icon: Rocket,
    title: 'Startup OS Partnership',
    tag: 'Full Partnership',
    description: 'We act as your full digital partner — branding, tech, and execution.',
    price: { usd: 1000, ngn: 1500000, usdt: 1000 },
    features: [
      'Full Product Development Team',
      'Brand + Tech + Social Execution',
      'Website + App + Systems',
      'Monthly Growth Management',
      'Priority Support',
    ],
    featured: true,
  },
];

export default function ServicesPage() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="pt-32 pb-16 px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="text-brand-blue text-xs tracking-[0.3em] uppercase border border-brand-blue/30 px-4 py-1.5 inline-block mb-8">
            Our Services
          </span>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="font-bebas text-[clamp(3rem,8vw,7rem)] leading-[0.9] mb-6"
        >
          <span className="block text-white">BUILD SYSTEMS</span>
          <span className="block text-brand-blue">NOT JUST SERVICES</span>
        </motion.h1>
        <p className="text-white/40 max-w-xl mx-auto text-lg leading-relaxed">
          TechMindsVerse delivers execution systems for startups, brands, and founders.
          Choose your package and we will contact you to get started.
        </p>
      </section>

      {/* SERVICES GRID */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-8 border rounded-sm relative ${
                s.featured
                  ? 'border-brand-blue/40 bg-brand-blue/5'
                  : 'border-white/10 bg-black hover:border-white/20'
              } transition-colors`}
            >
              {s.featured && (
                <span className="absolute top-4 right-4 text-xs text-brand-blue border border-brand-blue/30 px-2 py-0.5">
                  Most Popular
                </span>
              )}

              <div className="flex items-center gap-3 mb-4">
                <s.icon className="text-brand-blue" size={24} />
                <span className="text-xs text-white/30 border border-white/10 px-2 py-0.5">
                  {s.tag}
                </span>
              </div>

              <h3 className="font-bebas text-3xl text-white mb-2">{s.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed mb-5">{s.description}</p>

              {/* Pricing */}
              <div className="border border-white/5 p-4 mb-5 space-y-1">
                <p className="text-white/20 text-xs uppercase tracking-wider mb-2">Starting from</p>
                <p className="text-white font-semibold">${s.price.usd} USD</p>
                <p className="text-white/40 text-sm">₦{s.price.ngn.toLocaleString()} NGN</p>
                <p className="text-white/40 text-sm">{s.price.usdt} USDT</p>
              </div>

              {/* Features */}
              <div className="space-y-2 mb-6">
                {s.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/50 text-sm">
                    <CheckCircle size={13} className="text-brand-blue shrink-0" />
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA — goes to contact with service pre-selected */}
              <Link
                href={`/contact?service=${encodeURIComponent(s.title)}`}
                className={`inline-flex items-center gap-2 px-6 py-3 text-sm font-medium transition ${
                  s.featured
                    ? 'bg-brand-blue text-white hover:bg-blue-600'
                    : 'border border-white/20 text-white hover:border-brand-blue hover:text-brand-blue'
                }`}
              >
                Get Started <ArrowRight size={14} />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CUSTOM WORK */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <Zap size={32} className="text-brand-blue mx-auto mb-4" />
          <h2 className="font-bebas text-5xl text-white mb-4">NEED SOMETHING CUSTOM?</h2>
          <p className="text-white/40 mb-8 leading-relaxed">
            If your project doesn't fit a package, use the Build Studio. We scope, plan,
            and build exactly what you need from scratch.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/build"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-3 font-medium hover:bg-blue-600 transition"
            >
              Start a Custom Build <ArrowRight size={16} />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 border border-white/20 text-white px-8 py-3 font-medium hover:border-white/40 transition"
            >
              <MessageSquare size={16} /> Talk to Us First
            </Link>
          </div>
        </div>
      </section>

    </PublicLayout>
  );
}