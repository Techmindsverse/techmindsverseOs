import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6 text-center">
      <div>
        <p className="font-bebas text-[8rem] text-white/5 leading-none select-none">404</p>
        <h1 className="font-bebas text-4xl text-white -mt-8 mb-4">PAGE NOT FOUND</h1>
        <p className="text-white/40 text-sm mb-8 max-w-xs mx-auto">
          This page doesn't exist in the ecosystem yet.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="px-6 py-3 bg-brand-blue text-white text-sm hover:bg-blue-700 transition">
            Go Home
          </Link>
          <Link href="/dashboard" className="px-6 py-3 border border-white/10 text-white/60 hover:text-white text-sm transition">
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}