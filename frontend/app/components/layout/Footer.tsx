import Link from 'next/link';

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.9-6.4L6.3 22H2l7.3-8.4L1 2h6.3l4.4 5.8L18.9 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M20.4 20.4h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6h.1c.5-1 1.8-2.1 3.7-2.1 4 0 4.8 2.6 4.8 6V20.4zM5.3 7.6a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.4H3.5V9h3.6v11.4z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M12 .5C5.7.5.7 5.7.7 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.2.8-.6v-2.2c-3.2.7-3.9-1.3-3.9-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 .1.8 2 .8 2.5 1.5.2 3.1-.1 4.6-.8 0-1 .4-1.7.8-2.1-2.6-.3-5.4-1.3-5.4-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.3 1.2.9-.2 1.9-.3 2.9-.3s2 .1 2.9.3c2.3-1.5 3.3-1.2 3.3-1.2.6 1.6.2 2.8.1 3.1.8.9 1.2 2 1.2 3.3 0 4.5-2.8 5.5-5.5 5.8.5.5.9 1.4.9 2.8v4.1c0 .4.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.3 5.7 18.3.5 12 .5z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
    <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07C2 17.08 5.66 21.21 10.44 21.95v-7.03H7.9v-2.85h2.54V9.41c0-2.51 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.85h-2.34v7.03C18.34 21.21 22 17.08 22 12.07z"/>
  </svg>
);

const footerLinks = {
  Platform: [
    { label: 'Academy', href: '/academy' },
    { label: 'Build', href: '/build' },
    { label: 'Services', href: '/services' },
    { label: 'Products', href: '/products' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Team', href: '/team' },
    { label: 'Contact', href: '/contact' },
  ],
  Account: [
    { label: 'Login', href: '/login' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
};

const socials = [
  { icon: TwitterIcon, href: 'https://x.com/ShedrackNliam', label: 'Twitter' },
  { icon: LinkedinIcon, href: 'https://www.linkedin.com/in/shedrack-nliam-856980309', label: 'LinkedIn' },
  { icon: GithubIcon, href: 'https://github.com/SheddyDeCoder', label: 'GitHub' },
  { icon: FacebookIcon, href: 'https://facebook.com/shedrack.nliam', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className="border-t border-brand-border bg-brand-gray">
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* LOGO */}
          <div className="lg:col-span-2">
           
                
          <Link href="/" className="flex items-center gap-2 group">
           <img
    src="/logo.png"
    alt="TechMindsVerse Logo"
    className="w-12 h-12 relative z-10 rounded-md hover:scale-110 transition-transform duration-300"
  />
              <span className="font-bebas text-xl tracking-widest text-white">
                TECHMINDSVERSE
              </span>
            </Link>

            <p className="text-white/50 text-sm leading-relaxed max-w-xs">
              TechMindsVerse is a tech ecosystem designed to build people, products, and systems —
              combining learning, execution, and real-world digital solutions into one platform.
            </p>

            {/* SOCIALS */}
            <div className="flex items-center gap-4 mt-6">
              {socials.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="text-white/40 hover:text-brand-blue transition-colors"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* LINKS */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold mb-4 tracking-wider uppercase">
                {title}
              </h4>

              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-white/50 text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* BOTTOM */}
        <div className="border-t border-brand-border mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-white/30 text-sm">
            © 2026 TechMindsVerse. All rights reserved.
          </p>

          <p className="text-white/30 text-sm">
            Built by{' '}
            <a
              href="https://x.com/ShedrackNliam"
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-blue hover:underline"
            >
              Sheddy De Coder
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
}