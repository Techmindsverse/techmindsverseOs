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
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">The People</span>
          <h1 className="font-bebas text-6xl md:text-9xl text-white mt-2 leading-none mb-16">
            MEET THE
            <br />
            <span className="text-brand-blue">TEAM</span>
          </h1>

          <div className="grid md:grid-cols-2 gap-12">
            {team.map((member, i) => (
              <div key={i} className="border border-white/10 p-8 hover:border-brand-blue/30 transition-colors">
                <div className="flex items-start gap-6 mb-6">
                  <div className="w-20 h-20 rounded-sm overflow-hidden shrink-0 border border-white/10">
                    <Image
                      src={member.image}
                      alt={member.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="font-bebas text-2xl text-white">{member.name}</h2>
                    <p className="text-brand-blue text-sm tracking-wide">{member.role}</p>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed mb-6">{member.bio}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {member.skills.map((skill, j) => (
                    <span key={j} className="text-xs text-white/30 border border-white/10 px-3 py-1">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-4">
                  <Link href={member.socials.twitter} target="_blank" className="text-white/30 hover:text-white transition-colors">
                    <FaXTwitter size={16} />
                  </Link>
                  <Link href={member.socials.linkedin} target="_blank" className="text-white/30 hover:text-white transition-colors">
                    <FaLinkedinIn size={16} />
                  </Link>
                  <Link href={member.socials.github} target="_blank" className="text-white/30 hover:text-white transition-colors">
                    <FaGithub size={16} />
                  </Link>
                  <Link href={member.socials.facebook} target="_blank" className="text-white/30 hover:text-white transition-colors">
                    <FaFacebookF size={16} />
                  </Link>
                </div>
              </div>
            ))}

            <div className="border border-dashed border-white/10 p-8 flex flex-col items-center justify-center text-center hover:border-brand-blue/30 transition-colors">
              <h3 className="font-bebas text-3xl text-white mb-3">JOIN THE TEAM</h3>
              <p className="text-white/30 text-sm leading-relaxed mb-6">
                We are building a team of builders, designers, and creators. If you are passionate about execution, we want to hear from you.
              </p>
              <Link href="/contact" className="text-brand-blue text-sm hover:underline">
                Get in touch →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}