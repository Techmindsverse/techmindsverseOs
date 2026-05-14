'use client';

import { useState } from 'react';
import PublicLayout from '@/app/components/layout/PublicLayout';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    category: 'Academy',
    items: [
      {
        q: 'How do I enroll in the academy?',
        a: 'Go to the Academy page, select your course, and click Enroll Now. Fill in the enrollment form and our team will contact you with payment details within 24 hours.',
      },
      {
        q: 'What happens after I make payment?',
        a: 'After payment, our admin verifies it and approves your enrollment. You will receive an activation email with a link to set your password and access your dashboard.',
      },
      {
        q: 'How long does account activation take?',
        a: 'Once payment is verified, activation typically happens within 24-48 hours. You will receive an email with your activation link.',
      },
      {
        q: 'What if my activation link expired?',
        a: 'Contact us at techmindsverse@gmail.com and we will send you a new activation link.',
      },
      {
        q: 'Are classes physical or online?',
        a: 'TechMindsVerse Academy offers both physical classes (where available) and video-based learning. You can access course materials through your student dashboard.',
      },
    ],
  },
  {
    category: 'Build Studio',
    items: [
      {
        q: 'How do I start a build project?',
        a: 'Go to the Build page and submit your project request. Our team will review it and contact you within 24-48 hours to discuss scope, timeline, and pricing.',
      },
      {
        q: 'How much does a project cost?',
        a: 'Project costs depend on scope, complexity, and timeline. We provide custom quotes after reviewing your requirements. Browse our Services page for package pricing.',
      },
      {
        q: 'How long does a project take?',
        a: 'Project timelines vary based on complexity. Simple websites take 1-2 weeks. Full applications typically take 4-12 weeks. We provide detailed timelines during project planning.',
      },
      {
        q: 'What is the difference between Build Studio and Services?',
        a: 'Services are predefined packages with fixed scope and pricing. Build Studio is for custom projects that require scoping, planning, and tailored execution.',
      },
    ],
  },
  {
    category: 'Payments & Accounts',
    items: [
      {
        q: 'What payment methods do you accept?',
        a: 'We currently accept bank transfers and crypto (USDT). Payment details will be provided after your enrollment or project request is reviewed.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Go to the login page and click "Forgot password?". Enter your email and we will send you a reset link.',
      },
      {
        q: 'Can I get a refund?',
        a: 'Refund eligibility depends on the service and stage. See our Refund Policy for full details.',
      },
      {
        q: 'How do I contact support?',
        a: 'Logged-in users can submit a complaint through the dashboard. Others can reach us at techmindsverse@gmail.com or through the Contact page.',
      },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/5 hover:border-white/10 transition">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <span className="text-white text-sm font-medium pr-4">{q}</span>
        <ChevronDown
          size={16}
          className={`text-white/30 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div className="px-6 pb-4">
          <p className="text-white/50 text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Help</span>
          <h1 className="font-bebas text-6xl text-white mt-2 mb-4">FREQUENTLY ASKED QUESTIONS</h1>
          <p className="text-white/40 mb-12">Find answers to common questions about TechMindsVerse.</p>

          <div className="space-y-12">
            {faqs.map((section, i) => (
              <div key={i}>
                <h2 className="font-bebas text-2xl text-brand-blue mb-4 tracking-wide">
                  {section.category.toUpperCase()}
                </h2>
                <div className="space-y-2">
                  {section.items.map((item, j) => (
                    <FAQItem key={j} q={item.q} a={item.a} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 border border-white/5 p-8 text-center">
            <h3 className="font-bebas text-2xl text-white mb-3">STILL HAVE QUESTIONS?</h3>
            <p className="text-white/40 text-sm mb-6">
              Can not find what you are looking for? Reach out to us directly.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-brand-blue text-white px-6 py-3 text-sm font-medium hover:bg-blue-600 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}