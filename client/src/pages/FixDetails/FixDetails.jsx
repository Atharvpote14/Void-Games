import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
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

function SolutionSteps({ fix }) {
  const blocks = useMemo(
    () => parseArticleBlocks(fix.solution),
    [fix.solution]
  )
  const steps = blocks.filter((block) => block.type === 'ordered')
  const extra = blocks.filter((block) => block.type !== 'ordered')

  return (
    <div className="flex flex-col gap-6">
      {steps.map((step, index) => (
        <div key={index} className="flex gap-4">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
            {index + 1}
          </span>
          <div className="flex flex-col gap-3 pt-1.5">
            {step.items.map((item, itemIndex) => (
              <p key={itemIndex} className="leading-relaxed text-text-secondary">
                {item}
              </p>
            ))}
          </div>
        </div>
      ))}
      {extra.map((block, index) => (
        <p
          key={`extra-${index}`}
          className="leading-relaxed text-text-muted first:mt-2"
        >
          {block.text}
        </p>
      ))}
    </div>
  )
}

function InfoCard({ icon: Icon, tone, title, content }) {
  if (!content) return null
  return (
    <div className="rounded-card border border-border-default bg-void-card p-5">
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
        <Icon className={`size-4 ${tone}`} />
        {title}
      </h2>
      <p className="leading-relaxed text-text-secondary">{content}</p>
    </div>
  )
}

function FixDetails() {
  const { slug } = useParams()
  const {
    data: fix,
    loading,
    error,
    refetch,
  } = useFetch(() => getFixBySlug(slug), [slug])

  usePageMeta({
    title: fix?.title || 'Fix',
    description:
      fix?.problem ||
      'Troubleshooting guide from the Void Games Fix Center.',
    path: `/fix/${slug}`,
  })

  if (loading) {
    return (
      <PageWrapper>
        <Container className="flex flex-col gap-8 py-8 md:py-12">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-10 w-3/4 max-w-xl" />
          <Skeleton className="h-40 w-full rounded-card" />
          <Skeleton className="h-64 w-full rounded-card" />
        </Container>
      </PageWrapper>
    )
  }

  if (error || !fix) {
    return (
      <PageWrapper>
        <Container className="py-12">
          <ErrorState
            title="Fix not found"
            description="The fix you are looking for does not exist or was removed."
            onRetry={refetch}
          />
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-8 md:py-12">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Fix Center', path: '/fixes' },
            { label: fix.title, path: `/fix/${fix.slug}` },
          ]}
        />

        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="warning">Fix</Badge>
            {fix.category && <Badge tone="secondary">{fix.category}</Badge>}
          </div>
          <h1 className="max-w-3xl font-display text-[28px] leading-tight font-extrabold text-text-primary md:text-[40px]">
            {fix.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(fix.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4" />
              {formatNumber(fix.views)} views
            </span>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-6">
            <InfoCard
              icon={AlertTriangle}
              tone="text-warning"
              title="The Problem"
              content={fix.problem}
            />
            <InfoCard
              icon={ClipboardList}
              tone="text-secondary"
              title="Symptoms"
              content={fix.symptoms}
            />
            <div className="rounded-card border border-border-default bg-void-card p-6 md:p-8">
              <h2 className="mb-6 flex items-center gap-2 font-display text-xl font-bold text-text-primary">
                <ListChecks className="size-5 text-primary" />
                Step-by-Step Solution
              </h2>
              <SolutionSteps fix={fix} />
            </div>
            <div className="flex items-start gap-3 rounded-card border border-success/30 bg-success/10 p-4">
              <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-success" />
              <p className="text-sm leading-relaxed text-text-secondary">
                Still having issues? Check the related fixes below, or revisit
                this fix after updating your graphics drivers and game to the
                latest version.
              </p>
            </div>
          </div>

          <aside className="flex flex-col gap-6">
            {fix.game_slug && (
              <div className="rounded-card border border-border-default bg-void-card p-5">
                <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
                  <Wrench className="size-4 text-warning" />
                  Related Game
                </h2>
                <p className="mb-3 text-sm text-text-muted">{fix.game_title}</p>
                <Link
                  to={`/game/${fix.game_slug}`}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  View game page →
                </Link>
              </div>
            )}
            <div className="rounded-card border border-warning/30 bg-warning/10 p-5">
              <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
                <AlertTriangle className="size-4 text-warning" />
                Before You Try
              </h2>
              <p className="text-sm leading-relaxed text-text-muted">
                Always back up your save files before editing config files, and
                restore any changed file to its default if the fix does not
                work.
              </p>
            </div>
          </aside>
        </div>

        {fix.related && fix.related.length > 0 && (
          <section className="flex flex-col gap-6">
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
