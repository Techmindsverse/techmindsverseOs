import PublicLayout from '@/app/components/layout/PublicLayout';
import Link from 'next/link';
import { ArrowRight, Code2, Palette, Video, Bot, Brush } from 'lucide-react';

const courses = [
  {
    icon: Code2,
    title: 'Full-Stack Development',
    type: 'Technical',
    description: 'HTML, CSS, JavaScript, React, Node.js, Supabase — build and deploy real applications.',
    outcome: 'Build and deploy full-stack applications independently',
    duration: '12 Weeks',
    price: {
      naira: '₦250,000',
      usdt: '150 USDT',
      usd: '$180',
    },
  },
  {
    icon: Palette,
    title: 'UI/UX & Product Design',
    type: 'Design',
    description: 'Figma, wireframing, prototyping, design systems — create products people love to use.',
    outcome: 'Design clean, usable digital products',
    duration: '8 Weeks',
    price: {
      naira: '₦180,000',
      usdt: '110 USDT',
      usd: '$130',
    },
  },
  {
    icon: Brush,
    title: 'Graphic Design & Branding',
    type: 'Creative',
    description: 'Logo design, typography, color theory, brand identity systems using Canva and Figma.',
    outcome: 'Create professional brand visuals and marketing assets',
    duration: '6 Weeks',
    price: {
      naira: '₦120,000',
      usdt: '80 USDT',
      usd: '$95',
    },
  },
  {
    icon: Video,
    title: 'Video Editing & Videography',
    type: 'Media',
    description: 'CapCut, Premiere Pro, storytelling, ads.',
    outcome: 'Produce engaging video content for brands and creators',
    duration: '6 Weeks',
    price: {
      naira: '₦120,000',
      usdt: '80 USDT',
      usd: '$95',
    },
  },
  {
    icon: Bot,
    title: 'Prompt Engineering & AI Tools',
    type: 'AI & Automation',
    description: 'ChatGPT, AI workflows, automation systems.',
    outcome: 'Use AI tools to build, automate, and scale digital work',
    duration: '4 Weeks',
    price: {
      naira: '₦90,000',
      usdt: '60 USDT',
      usd: '$70',
    },
  },
];

export default function AcademyPage() {
  return (
    <PublicLayout>

      {/* HERO */}
      <section className="py-32 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Learn & Build</span>

          <h1 className="font-bebas text-6xl md:text-9xl text-white mt-2 leading-none">
            TECHMINDSVERSE
            <br />
            <span className="text-brand-blue">ACADEMY</span>
          </h1>

          <p className="text-white/40 max-w-2xl mt-6 text-lg leading-relaxed">
            A practical, project-based learning platform combining physical and video-based learning to build real-world tech, design, and digital skills.
          </p>

          <div className="flex flex-wrap gap-4 mt-8">
            <div className="border border-white/10 px-4 py-2 text-white/50 text-sm">Project-Based Learning</div>
            <div className="border border-white/10 px-4 py-2 text-white/50 text-sm">Physical + Video Classes</div>
            <div className="border border-white/10 px-4 py-2 text-white/50 text-sm">Real-World Projects</div>
            <div className="border border-white/10 px-4 py-2 text-white/50 text-sm">Student Dashboard</div>
          </div>
        </div>
      </section>

      {/* COURSES */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">

          <h2 className="font-bebas text-5xl text-white mb-12">
            AVAILABLE COURSES
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {courses.map((course, i) => (
              <div
                key={i}
                className="border border-white/10 p-8 hover:border-brand-blue/40 transition-colors group flex flex-col"
              >

                {/* top */}
                <div className="flex items-start justify-between mb-6">
                  <course.icon size={24} className="text-brand-blue" />
                  <span className="text-xs text-white/30 border border-white/10 px-2 py-1">
                    {course.type}
                  </span>
                </div>

                {/* title */}
                <h3 className="font-bebas text-2xl text-white mb-3">
                  {course.title}
                </h3>

                {/* description */}
                <p className="text-white/40 text-sm leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* NEW: duration + price */}
                <div className="text-sm text-white/60 mb-6 space-y-1">
                  <p>
                    <span className="text-white/40">Duration:</span> {course.duration}
                  </p>
                  <p className="text-white/80 font-medium">
                    {course.price.naira} • {course.price.usdt} • {course.price.usd}
                  </p>
                </div>

                {/* footer */}
                <div className="border-t border-white/5 pt-4 mt-auto">

                  <p className="text-xs text-white/30 mb-4">
                    Outcome: {course.outcome}
                  </p>

                  {/* FIXED CTA */}
                  <Link
                    href={`/academy/enroll?course=${encodeURIComponent(course.title)}`}
                    className="flex items-center gap-2 text-brand-blue text-sm group-hover:gap-3 transition-all"
                  >
                    Enroll Now <ArrowRight size={14} />
                  </Link>

                </div>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 px-6 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-7xl mx-auto">

          <h2 className="font-bebas text-5xl text-white mb-12">
            HOW IT WORKS
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              { step: '01', title: 'Select Course', desc: 'Choose the track that matches your goals' },
              { step: '02', title: 'Make Payment', desc: 'Pay via USDT, Naira transfer, or PayPal' },
              { step: '03', title: 'Verification', desc: 'Admin confirms payment and activates your account' },
              { step: '04', title: 'Start Learning', desc: 'Access dashboard, lessons, and projects' },
            ].map((item, i) => (
              <div key={i} className="border border-white/5 p-6">
                <div className="font-bebas text-4xl text-brand-blue/30 mb-4">
                  {item.step}
                </div>
                <h3 className="font-bebas text-xl text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-white/40 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">

          <h2 className="font-bebas text-6xl text-white mb-4">
            READY TO START?
          </h2>

          <p className="text-white/40 mb-8">
            Join TechMindsVerse Academy and build real skills through real projects.
          </p>

          <Link
            href="/academy/enroll"
            className="inline-flex items-center gap-2 bg-brand-blue text-white px-8 py-4 font-semibold hover:bg-blue-600 transition"
          >
            Get Started <ArrowRight size={16} />
          </Link>

        </div>
      </section>

    </PublicLayout>
  );
}