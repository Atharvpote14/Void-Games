import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Download,
  Eye,
  ListChecks,
  Wrench,
} from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Grid from '@/layouts/Grid/Grid'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import Badge from '@/components/common/Badge/Badge'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import FixCard from '@/components/cards/FixCard/FixCard'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { getFixBySlug } from '@/services/fixes'
import { parseArticleBlocks } from '@/utils/content'
import { formatDate, formatNumber } from '@/utils/formatters'
import { cn } from '@/utils/cn'

function SolutionSteps({ fix }) {
  const blocks = useMemo(() => parseArticleBlocks(fix.solution), [fix.solution])
  const steps = blocks.filter((b) => b.type === 'ordered')
  const extra = blocks.filter((b) => b.type !== 'ordered')

  return (
    <div className="flex flex-col gap-5">
      {steps.map((step, i) => (
        <div key={i} className="flex gap-4">
          <span className={cn(
            'grid size-10 shrink-0 place-items-center rounded-xl font-display text-base font-bold shadow-[0_0_15px_rgba(212,175,100,0.15)]',
            'bg-gradient-to-br from-gold/20 to-gold-deep/30 text-gold border border-gold/20'
          )}>
            {i + 1}
          </span>
          <div className="flex flex-col gap-2 pt-1">
            {step.items.map((item, idx) => (
              <p key={idx} className="leading-relaxed text-text-secondary text-[15px]">{item}</p>
            ))}
          </div>
        </div>
      ))}
      {extra.map((block, i) => (
        <p key={`extra-${i}`} className="leading-relaxed text-text-muted text-sm first:mt-2">{block.text}</p>
      ))}
    </div>
  )
}

function InfoCard({ icon: Icon, tone, title, content }) {
  if (!content) return null
  return (
    <div className="relative overflow-hidden rounded-card border border-white/[0.08] bg-gradient-to-b from-void-card-elevated/80 to-void-card/95 p-6 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-lg font-bold text-text-primary tracking-tight">
        <span className={cn('grid size-8 place-items-center rounded-lg shadow-sm', tone === 'text-warning' ? 'bg-warning/10 border border-warning/30 text-warning' : 'bg-gold/10 border border-gold/20 text-gold')}>
          <Icon className="size-4" />
        </span>
        {title}
      </h2>
      <p className="leading-relaxed text-text-secondary text-[15px]">{content}</p>
    </div>
  )
}

function FixDetails() {
  const { slug } = useParams()
  const { data: fix, loading, error, refetch } = useFetch(() => getFixBySlug(slug), [slug])

  usePageMeta({
    title: fix?.title || 'Fix',
    description: fix?.problem || 'Troubleshooting guide from the Void Games Fix Center.',
    path: `/fix/${slug}`,
  })

  if (loading) {
    return (
      <PageWrapper>
        <Container className="flex flex-col gap-8 py-8 md:py-12">
          <Skeleton className="h-5 w-56 animate-fade-in" />
          <Skeleton className="h-12 w-3/4 max-w-2xl animate-fade-in" style={{ animationDelay: '100ms' }} />
          <Skeleton className="h-48 w-full rounded-card animate-fade-in" style={{ animationDelay: '200ms' }} />
          <Skeleton className="h-72 w-full rounded-card animate-fade-in" style={{ animationDelay: '300ms' }} />
        </Container>
      </PageWrapper>
    )
  }

  if (error || !fix) {
    return (
      <PageWrapper>
        <Container className="py-12">
          <ErrorState title="Fix not found" description="The fix you are looking for does not exist or was removed." onRetry={refetch} />
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-8 md:py-12 animate-fade-in">
        <Breadcrumb items={[
          { label: 'Home', path: '/' },
          { label: 'Fix Center', path: '/fixes' },
          { label: fix.title, path: `/fix/${fix.slug}` },
        ]} />

        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="primary" className="bg-gradient-to-r from-gold/20 to-gold/10 border-gold/30 text-gold shadow-[0_0_10px_rgba(212,175,100,0.15)]">Fix</Badge>
            {fix.category && <Badge tone="secondary">{fix.category}</Badge>}
          </div>
          <h1 className="heading-2 max-w-4xl font-display font-bold text-3xl md:text-5xl leading-tight tracking-tight text-text-primary">{fix.title}</h1>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5"><CalendarDays className="size-4 text-gold/60" />{formatDate(fix.created_at)}</span>
            <span className="inline-flex items-center gap-1.5"><Eye className="size-4 text-gold/60" />{formatNumber(fix.views)} views</span>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col gap-6">
            <InfoCard icon={AlertTriangle} tone="text-warning" title="The Problem" content={fix.problem} />
            <InfoCard icon={ClipboardList} tone="text-secondary" title="Symptoms" content={fix.symptoms} />

            <div className="relative overflow-hidden rounded-card border border-white/[0.08] bg-gradient-to-b from-void-card-elevated/80 to-void-card/95 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <h2 className="mb-6 flex items-center gap-3 font-display text-xl font-bold text-text-primary tracking-tight">
                <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold/20 to-gold-deep/30 border border-gold/20 text-gold shadow-[0_0_12px_rgba(212,175,100,0.15)]">
                  <ListChecks className="size-5" />
                </span>
                Step-by-Step Solution
              </h2>
              <SolutionSteps fix={fix} />
            </div>

            {Array.isArray(fix.links) && fix.links.length > 0 && (
              <div className="relative overflow-hidden rounded-card border border-white/[0.08] bg-gradient-to-b from-void-card-elevated/80 to-void-card/95 p-6 md:p-8 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <h2 className="mb-4 flex items-center gap-3 font-display text-xl font-bold text-text-primary tracking-tight">
                  <span className="grid size-9 place-items-center rounded-xl bg-gradient-to-br from-gold/20 to-gold-deep/30 border border-gold/20 text-gold shadow-[0_0_12px_rgba(212,175,100,0.15)]"><Download className="size-5" /></span>
                  Downloads & Resources
                </h2>
                <div className="flex flex-wrap gap-3">
                  {fix.links.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer"
                      className="group relative inline-flex items-center gap-3 rounded-xl bg-gradient-to-br from-void-card-elevated via-void-card-hover to-void-deep border border-gold/30 px-6 py-3.5 text-sm font-display font-bold text-gold shadow-[0_8px_30px_rgba(212,175,100,0.10),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_12px_40px_rgba(212,175,100,0.25),inset_0_1px_0_rgba(212,175,100,0.15)] hover:brightness-110 overflow-hidden">
                      <span className="absolute inset-0 bg-gradient-to-r from-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Download className="size-5 text-gold relative z-10 group-hover:scale-110 transition-transform duration-300" />
                      <span className="relative z-10">{link.label || 'Download'}</span>
                      <span className="ml-2 rounded-md bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold tracking-wide border border-gold/20">LINK</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-start gap-4 rounded-card border border-success/30 bg-gradient-to-r from-success/10 to-success/[0.05] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.2)] animate-slide-up">
              <CheckCircle2 className="mt-0.5 size-6 shrink-0 text-success drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
              <div>
                <h3 className="font-display text-base font-bold text-text-primary mb-1">Still having issues?</h3>
                <p className="text-sm leading-relaxed text-text-secondary">Check related fixes below, or revisit this after updating graphics drivers and the game to the latest version.</p>
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            {fix.game_slug && (
              <div className="relative overflow-hidden rounded-card border border-white/[0.08] bg-gradient-to-b from-void-card-elevated/80 to-void-card/95 p-5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
                <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-text-primary tracking-tight"><Wrench className="size-4 text-gold" /> Related Game</h2>
                <p className="mb-3 text-sm text-text-muted">{fix.game_title}</p>
                <Link to={`/game/${fix.game_slug}`} className="inline-flex items-center gap-1.5 text-sm font-bold text-gold hover:text-gold-soft transition-colors">View game page →</Link>
              </div>
            )}
            <div className="relative overflow-hidden rounded-card border border-warning/30 bg-gradient-to-b from-warning/10 to-warning/[0.05] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.3)]">
              <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-text-primary tracking-tight"><AlertTriangle className="size-4 text-warning" /> Before You Try</h2>
              <p className="text-sm leading-relaxed text-text-muted">Always back up save files before editing config files. Restore any changed file to default if the fix doesn't work.</p>
            </div>
          </aside>
        </div>

        {fix.related && fix.related.length > 0 && (
          <section className="flex flex-col gap-6 animate-slide-up">
            <SectionHeading title="Related Fixes" />
            <Grid cols={4}>
              {fix.related.map((related) => (
                <FixCard key={related.id} fix={related} />
              ))}
            </Grid>
          </section>
        )}
      </Container>
    </PageWrapper>
  )
}

export default FixDetails
