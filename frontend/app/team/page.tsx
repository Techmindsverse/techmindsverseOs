import PublicLayout from '@/app/components/layout/PublicLayout';
import Image from 'next/image';
import Link from 'next/link';
import { FaXTwitter, FaLinkedinIn, FaGithub, FaFacebookF } from 'react-icons/fa6';

const team = [
  {
    name: 'Nliam Shedrack',
    role: 'Founder & CEO',
    bio: 'Full-stack developer and product builder focused on building scalable tech ecosystems. Started as a Social Media Manager and evolved into a full-stack developer combining technical expertise with digital growth strategy.',
    skills: ['React', 'Next.js', 'Node.js', 'Supabase', 'Product Design', 'System Architecture'],
    image: '/images/team/shedrack.jpg',
    socials: {
      twitter: 'https://x.com/ShedrackNliam',
      linkedin: 'https://www.linkedin.com/in/shedrack-nliam-856980309',
      github: 'https://github.com/sheddy146',
      facebook: 'https://www.facebook.com/shedrack.nliam',
    },
  },
];

export default function TeamPage() {
  return (
    <PublicLayout>

      {/* HERO HEADER */}
      <section className="py-32 px-6 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">
            The People
          </span>

          <h1 className="font-bebas text-6xl md:text-9xl text-white mt-2 leading-none">
            MEET THE
            <br />
            <span className="text-brand-blue">TEAM</span>
          </h1>

          <p className="text-white/40 max-w-xl mt-6 text-lg">
            The minds building TechMindsVerse — creators, builders, and vision drivers.
          </p>
        </div>
      </section>

      {/* FULL SCREEN TEAM SECTIONS */}
      {team.map((member, i) => (
        <section
          key={i}
          className="min-h-screen flex items-center px-6 border-b border-white/5"
        >
          <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">

            {/* LEFT TEXT */}
            <div className="space-y-6">

              <div>
                <h2 className="font-bebas text-5xl md:text-7xl text-white leading-none">
                  {member.name}
                </h2>
                <p className="text-brand-blue text-sm tracking-widest uppercase mt-2">
                  {member.role}
                </p>
              </div>

              <p className="text-white/50 text-lg leading-relaxed max-w-xl">
                {member.bio}
              </p>

              {/* SKILLS */}
              <div className="flex flex-wrap gap-3">
                {member.skills.map((skill, j) => (
                  <span
                    key={j}
                    className="text-xs text-white/30 border border-white/10 px-3 py-1"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* SOCIALS */}
              <div className="flex items-center gap-6 pt-4">
                <Link href={member.socials.twitter} target="_blank" className="text-white/30 hover:text-white transition">
                  <FaXTwitter size={18} />
                </Link>
                <Link href={member.socials.linkedin} target="_blank" className="text-white/30 hover:text-white transition">
                  <FaLinkedinIn size={18} />
                </Link>
                <Link href={member.socials.github} target="_blank" className="text-white/30 hover:text-white transition">
                  <FaGithub size={18} />
                </Link>
                <Link href={member.socials.facebook} target="_blank" className="text-white/30 hover:text-white transition">
                  <FaFacebookF size={18} />
                </Link>
              </div>

            </div>

            {/* RIGHT IMAGE */}
            <div className="relative group">

              <div className="w-full h-[70vh] overflow-hidden border border-white/10">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={800}
                  height={800}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* subtle glow */}
              <div className="absolute inset-0 bg-brand-blue/10 blur-3xl opacity-30 group-hover:opacity-40 transition" />

            </div>

          </div>
        </section>
      ))}

      {/* JOIN TEAM (BOTTOM CTA) */}
      <section className="py-32 px-6">
        <div className="max-w-3xl mx-auto text-center">

          <h2 className="font-bebas text-6xl text-white mb-4">
            JOIN THE TEAM
          </h2>

          <p className="text-white/40 mb-10">
            We are building a team of builders, designers, and creators. If you are passionate about execution, we want to hear from you.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-brand-blue px-8 py-4 text-white font-semibold hover:bg-blue-600 transition"
          >
            Get in touch
          </Link>

        </div>
      </section>

    </PublicLayout>
  );
}