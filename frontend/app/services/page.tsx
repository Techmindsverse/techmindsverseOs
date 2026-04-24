'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Layers,
  Code2,
  Zap,
  CheckCircle,
  ArrowRight,
  Users,
  Rocket
} from 'lucide-react';

import PublicLayout from '@/app/components/layout/PublicLayout';

/* =========================
   SERVICES AS PRODUCTS
========================= */

const services = [
  {
    icon: Layers,
    title: 'Branding OS Package',
    description:
      'Full identity system for startups and businesses ready to dominate their market.',
    price: {
      usd: 250,
      ngn: 350000,
      usdt: 250
    },
    features: [
      'Logo & Brand Identity System',
      'Brand Strategy & Positioning',
      'Social Media Setup',
      'Visual Direction Kit',
      'Launch Branding Package'
    ]
  },

  {
    icon: Users,
    title: 'Social Media Management System',
    description:
      'We fully manage your digital presence and growth across all platforms.',
    price: {
      usd: 300,
      ngn: 450000,
      usdt: 300
    },
    features: [
      'Content Creation & Posting',
      'Page Management',
      'Growth Strategy',
      'Analytics & Reporting',
      'Community Engagement'
    ]
  },

  {
    icon: Code2,
    title: 'Product & Web Development',
    description:
      'We design and build scalable systems, platforms, and SaaS products.',
    price: {
      usd: 500,
      ngn: 800000,
      usdt: 500
    },
    features: [
      'Landing Pages & Web Apps',
      'Full-Stack Development',
      'Admin Dashboards',
      'API Integration',
      'Deployment'
    ]
  },

  {
    icon: Rocket,
    title: 'Startup OS Partnership',
    description:
      'We act as your full digital partner — branding, tech, and execution team.',
    price: {
      usd: 1000,
      ngn: 1500000,
      usdt: 1000
    },
    features: [
      'Full Product Development Team',
      'Brand + Tech + Social Execution',
      'Website + App + Systems',
      'Monthly Growth Management',
      'Priority Support'
    ]
  }
];

/* =========================
   PAGE
========================= */

export default function ServicesPage() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="pt-32 pb-16 text-center">

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bebas text-[clamp(3rem,8vw,7rem)] leading-[0.9]"
        >
          <span className="block bg-gradient-to-r from-[#1A3BDB] via-[#8B5CF6] to-[#1A3BDB] bg-clip-text text-transparent">
            BUILD SYSTEMS
          </span>
          <span className="block text-white">
            NOT JUST SERVICES
          </span>
        </motion.h1>

        <p className="text-white/60 max-w-2xl mx-auto mt-6">
          TechMindsVerse delivers execution systems for startups, brands, and founders — not random services.
        </p>

      </section>

      {/* SERVICES GRID */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-8">

          {services.map((s, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -8 }}
              className="p-8 border border-white/10 bg-black rounded-xl"
            >

              <s.icon className="text-brand-blue mb-4" size={30} />

              <h3 className="font-bebas text-3xl text-white">
                {s.title}
              </h3>

              <p className="text-white/50 mt-2 text-sm">
                {s.description}
              </p>

              {/* PRICE BLOCK */}
              <div className="mt-4 text-sm text-white/70">
                <p>USD: ${s.price.usd}</p>
                <p>NGN: ₦{s.price.ngn.toLocaleString()}</p>
                <p>USDT: {s.price.usdt}</p>
              </div>

              {/* FEATURES */}
              <div className="mt-5 space-y-2">
                {s.features.map((f, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-white/60 text-sm">
                    <CheckCircle size={14} className="text-brand-blue" />
                    {f}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Link
                href={`/build?service=${encodeURIComponent(s.title)}`}
                className="inline-flex items-center gap-2 mt-6 text-brand-blue"
              >
                Start Project <ArrowRight size={16} />
              </Link>

            </motion.div>
          ))}

        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center border-t border-white/10">

        <h2 className="font-bebas text-5xl text-white mb-4">
          READY TO BUILD SOMETHING REAL?
        </h2>

        <p className="text-white/60 mb-8">
          Choose a system, not just a service.
        </p>

        <Link
          href="/build"
          className="px-8 py-4 bg-brand-blue text-white rounded inline-flex items-center gap-2"
        >
          Start Now <ArrowRight size={16} />
        </Link>

      </section>

    </PublicLayout>
  );
}