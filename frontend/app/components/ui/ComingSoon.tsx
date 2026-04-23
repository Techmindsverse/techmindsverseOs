import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function ComingSoon({ title, description }: { title: string; description?: string }) {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <span className="text-brand-blue text-xs tracking-widest uppercase mb-6 border border-brand-blue/30 px-4 py-1.5">
        Phase 1 — In Build
      </span>
      <h2 className="font-bebas text-6xl md:text-8xl text-white mb-4">{title}</h2>
      <p className="text-white/40 max-w-md font-outfit leading-relaxed mb-8">
        {description || "This module is currently under active development. We're building something powerful here."}
      </p>
      <Link href="/" className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors">
        <ArrowLeft size={14} /> Back to Home
      </Link>
    </div>
  );
}