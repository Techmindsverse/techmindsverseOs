import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';
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
  description: 'A unified tech ecosystem combining learning, building, and digital execution. Academy, Build Studio, Community — all connected under one platform.',
  keywords: [
    'tech academy Nigeria', 'TechMindsVerse', 'learn coding Nigeria',
    'web development Nigeria', 'build studio', 'digital ecosystem',
    'tech community Nigeria', 'frontend development', 'fullstack Nigeria',
    'UI UX design', 'prompt engineering', 'AI tools Nigeria',
  ],
  authors: [{ name: 'TechMindsVerse', url: 'https://techmindsverse-os.vercel.app' }],
  creator: 'TechMindsVerse',
  publisher: 'TechMindsVerse',
  openGraph: {
    title: 'TechMindsVerse OS — Learn. Build. Ship.',
    description: 'One ecosystem for learning, building, and launching digital products.',
    url: 'https://techmindsverse-os.vercel.app',
    siteName: 'TechMindsVerse',
    type: 'website',
    locale: 'en_NG',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'TechMindsVerse OS',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TechMindsVerse OS',
    description: 'Learn. Build. Ship. One ecosystem.',
    creator: '@ShedrackNliam',
    images: ['/og-image.png'],
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1A3BDB',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={outfit.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="bg-black text-white antialiased min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}