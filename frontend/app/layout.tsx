import type { Metadata, Viewport } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/app/components/ThemeProvider';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
});

export const metadata: Metadata = {
  title: 'TechMindsVerse — Turning Ideas Into Real Digital Products',
  description: 'A unified tech ecosystem combining training, product building, and digital services.',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#1A3BDB',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${outfit.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-black text-white">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}