import Navbar from './Navbar';
import Footer from './Footer';
import PWAInstall from '@/app/components/PWAInstall';
import MobileNav from '@/app/components/MobileNav';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-black">
      <Navbar />
      <main className="flex-1 pb-16 lg:pb-0">
        {children}
      </main>
      <Footer />
      <PWAInstall />
      <MobileNav />
    </div>
  );
}