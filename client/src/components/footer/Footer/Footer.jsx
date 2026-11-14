import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/utils/cn'

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-border bg-surface">
      <div className="relative mx-auto max-w-7xl px-6 py-16 md:py-20 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-4 lg:gap-16">
          <div className="lg:col-span-2">
            <h2 className="text-headline-lg font-bold tracking-tight text-on-surface md:text-headline-md">
              The definitive <span className="text-primary">gaming marketplace.</span>
            </h2>
            <p className="mt-4 max-w-xl text-body-md text-on-surface-muted leading-relaxed">
              Curated downloads, premium guides, and a community built around exceptional games. No clutter. Only quality.
            </p>
          </div>
          <div>
            <h3 className="text-eyebrow text-on-surface-muted mb-4">Discover</h3>
            <ul className="space-y-2.5 text-body-sm text-on-surface-muted">
              {['Browse Games', 'Steam Free', 'Categories', 'Collections', 'Guides'].map(i => (
                <li key={i}><Link to='/' className='hover:text-primary transition-colors'>{i}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-eyebrow text-on-surface-muted mb-4">Platform</h3>
            <ul className="space-y-2.5 text-body-sm text-on-surface-muted">
              {['About', 'Contact', 'FAQ', 'Terms', 'Privacy'].map(i => (
                <li key={i}><Link to='/' className='hover:text-primary transition-colors'>{i}</Link></li>
              ))}
            </ul>
          </div>
        </div>
        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border pt-8 md:flex-row md:items-center">
          <p className="text-body-sm text-on-surface-muted">© 2026 Void Games. Premium gaming marketplace.</p>
          <Link to='/' className="group inline-flex items-center gap-1.5 text-label-sm text-primary transition-colors hover:text-primary-strong">
            Top of page <ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </footer>
  )
}