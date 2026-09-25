import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/utils/cn';

export default function LuxuryFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-white/[0.06] bg-void-surface">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(212,175,100,0.05),_transparent_60%)]" aria-hidden="true" />
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="font-display text-3xl font-bold tracking-tight text-text-primary md:text-4xl">The definitive <span className="text-gold">gaming marketplace.</span></h2>
            <p className="mt-4 max-w-lg text-text-secondary leading-relaxed">Curated downloads, premium guides, and a community built around exceptional games. No clutter. Only quality.</p>
          </div>
          <div>
            <h3 className="font-editorial text-xs font-bold uppercase tracking-[0.15em] text-text-muted mb-4">Discover</h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {['Browse Games','Steam Free','Categories','Collections','Guides'].map(i => (
                <li key={i}><Link to='/' className='hover:text-gold transition-colors'>{i}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-editorial text-xs font-bold uppercase tracking-[0.15em] text-text-muted mb-4">Platform</h3>
            <ul className="space-y-2.5 text-sm text-text-secondary">
              {['About','Contact','FAQ','Terms','Privacy'].map(i => (
                <li key={i}><Link to='/' className='hover:text-gold transition-colors'>{i}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/[0.06] pt-8 md:flex-row md:items-center">
          <p className="text-xs text-text-muted">© 2026 Void Games. Premium gaming marketplace.</p>
          <Link to='/' className="group inline-flex items-center gap-1.5 text-xs font-medium text-gold transition-colors hover:text-gold-soft">Top of page <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>
        </div>
      </div>
    </footer>
  );
}
