import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
import AuthHydrator from '@/app/components/AuthHydrator';
import { SpeedInsights } from '@vercel/speed-insights/next';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://techmindsverse-os.vercel.app'),
  title: {
    default: 'TechMindsVerse — Turning Ideas Into Real Digital Products',
    template: '%s | TechMindsVerse',
  },
  description:
    'A unified tech ecosystem combining learning, building, and digital execution. Academy, Build Studio, Community — all connected.',
  manifest: '/manifest.json',
  keywords: [
    'tech academy Nigeria', 'TechMindsVerse', 'learn coding Nigeria',
    'web development Nigeria', 'build studio', 'digital ecosystem',
  ],
};

export const viewport: Viewport = {
  themeColor: '#1A3BDB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning prevents the data-theme mismatch warning
    <html lang="en" className={outfit.variable} suppressHydrationWarning>
      <head>
        {/* Inline script to set theme before first render — eliminates flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('tmv_theme') || 'light';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {
                document.documentElement.setAttribute('data-theme', 'light');
              }
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-full flex flex-col">
        <ThemeProvider>
          <AuthHydrator />
          <SpeedInsights />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}