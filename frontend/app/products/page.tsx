import PublicLayout from '@/app/components/layout/PublicLayout';
import { ArrowRight } from 'lucide-react';

const features = [
  'Escrow-protected transactions',
  'Secure USDT trading system',
  'Merchant & user matching engine',
  'Low fees, high trust architecture',
  'Transaction status tracking',
  'P2P without intermediaries',
];

export default function ProductsPage() {
  return (
    <PublicLayout>
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-brand-blue text-xs tracking-widest uppercase">Built by the Verse</span>
          <h1 className="font-bebas text-6xl md:text-9xl text-white mt-2 leading-none mb-16">
            OUR
            <br />
            <span className="text-brand-blue">PRODUCTS</span>
          </h1>

          {/* P2P Pay */}
          <div className="border border-white/10 p-10 md:p-16 relative overflow-hidden hover:border-brand-blue/30 transition-colors mb-12">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-blue/5 rounded-full blur-3xl pointer-events-none" />
            <div className="relative">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs border border-brand-blue/30 text-brand-blue px-3 py-1">
                      Fintech
                    </span>
                    <span className="text-xs border border-yellow-500/30 text-yellow-500 px-3 py-1">
                      In Development
                    </span>
                    <span className="text-xs border border-white/10 text-white/30 px-3 py-1">
                      Private Beta
                    </span>
                  </div>
                  <h2 className="font-bebas text-6xl md:text-8xl text-white">P2P PAY</h2>
                </div>
              </div>

              <p className="text-white/50 text-lg max-w-2xl leading-relaxed mb-10">
                A peer-to-peer crypto exchange platform enabling secure USDT trading through an escrow-based system — safe, transparent, and reliable transactions without traditional intermediaries.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-10">
                {features.map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 text-white/50 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-blue shrink-0" />
                    {feature}
                  </div>
                ))}
              </div>

              <div className="border-t border-white/5 pt-8">
                <h3 className="font-bebas text-xl text-white mb-4">TARGET USERS</h3>
                <div className="flex flex-wrap gap-3 mb-8">
                  {['Crypto Traders', 'Merchants', 'USDT Buyers & Sellers'].map((user, i) => (
                    <span key={i} className="text-xs text-white/30 border border-white/10 px-3 py-1">
                      {user}
                    </span>
                  ))}
                </div>
                <p className="text-white/20 text-sm">
                  Private Beta launching soon. Follow our updates to get early access.
                </p>
              </div>
            </div>
          </div>

          {/* Future products */}
          <div className="border border-dashed border-white/10 p-10 text-center">
            <h3 className="font-bebas text-3xl text-white mb-3">MORE PRODUCTS COMING</h3>
            <p className="text-white/30 text-sm max-w-lg mx-auto leading-relaxed mb-6">
              TechMindsVerse is actively building more digital products. Every product we build solves a real problem for real people.
            </p>
            <a href="/build" className="inline-flex items-center gap-2 text-brand-blue text-sm hover:gap-3 transition-all">
              Have an idea? Build with us <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}