import { useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  ListOrdered,
  UserRound,
} from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Grid from '@/layouts/Grid/Grid'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import Badge from '@/components/common/Badge/Badge'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import GuideCard from '@/components/cards/GuideCard/GuideCard'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { getGuideBySlug } from '@/services/guides'
import { parseArticleBlocks, extractHeadings } from '@/utils/content'
import { formatDate, formatNumber } from '@/utils/formatters'

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function ArticleBlocks({ blocks }) {
  return (
    <div className="flex flex-col gap-6">
      {blocks.map((block, index) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={`${block.text}-${index}`}
              id={slugify(block.text)}
              className="scroll-mt-24 pt-2 font-display text-2xl font-bold text-text-primary"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === 'list') {
          return (
            <ul
              key={index}
              className="flex flex-col gap-2 pl-5 text-text-secondary"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="list-disc marker:text-primary">
                  {item}
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === 'ordered') {
          return (
            <ol
              key={index}
              className="flex flex-col gap-3 pl-1 text-text-secondary"
            >
              {block.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex gap-3">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                    {itemIndex + 1}
                  </span>
                  <span className="pt-0.5">{item}</span>
                </li>
              ))}
            </ol>
          )
        }
        return (
          <p key={index} className="leading-relaxed text-text-secondary">
            {block.text}
          </p>
        )
      })}
    </div>
  )
}

function GuideDetails() {
  const { slug } = useParams()
  const {
    data: guide,
    loading,
    error,
    refetch,
  } = useFetch(() => getGuideBySlug(slug), [slug])

  usePageMeta({
    title: guide?.title || 'Guide',
    description:
      guide?.content?.slice(0, 150) ||
      'Step-by-step game guide from the Void Games community.',
    path: `/guide/${slug}`,
  })

  const blocks = useMemo(
    () => (guide ? parseArticleBlocks(guide.content) : []),
    [guide]
  )
  const headings = useMemo(() => extractHeadings(blocks), [blocks])

  if (loading) {
    return (
      <PageWrapper>
        <Container className="flex flex-col gap-8 py-8 md:py-12">
          <Skeleton className="h-5 w-56" />
          <Skeleton className="h-10 w-3/4 max-w-xl" />
          <Skeleton className="aspect-video w-full rounded-card" />
          <Skeleton className="h-64 w-full rounded-card" />
        </Container>
      </PageWrapper>
    )
  }

  if (error || !guide) {
    return (
      <PageWrapper>
        <Container className="py-12">
          <ErrorState
            title="Guide not found"
            description="The guide you are looking for does not exist or was removed."
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
            { label: 'Guides', path: '/guides' },
            { label: guide.title, path: `/guide/${guide.slug}` },
          ]}
        />

        <header className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {guide.category && <Badge tone="secondary">{guide.category}</Badge>}
            {guide.is_featured && <Badge tone="primary">Featured</Badge>}
          </div>
          <h1 className="max-w-3xl font-display text-[28px] leading-tight font-extrabold text-text-primary md:text-[40px]">
            {guide.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              <UserRound className="size-4" />
              {guide.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="size-4" />
              {formatDate(guide.created_at)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {guide.reading_time} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="size-4" />
              {formatNumber(guide.views)} views
            </span>
          </div>
        </header>

        {guide.thumbnail && (
          <div className="overflow-hidden rounded-card border border-border-default">
            <LazyImage
              src={guide.thumbnail}
              alt={guide.title}
              className="aspect-[16/6] w-full object-cover"
            />
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="min-w-0 rounded-card border border-border-default bg-void-card p-6 md:p-10">
            <ArticleBlocks blocks={blocks} />
          </article>

          <aside className="flex flex-col gap-6">
            {headings.length > 0 && (
              <nav className="sticky top-24 rounded-card border border-border-default bg-void-card p-5">
                <h2 className="mb-4 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
                  <ListOrdered className="size-4 text-primary" />
                  Table of Contents
                </h2>
                <ul className="flex flex-col gap-2 border-l border-border-default">
                  {headings.map((heading) => (
                    <li key={heading.text}>
                      <a
                        href={`#${slugify(heading.text)}`}
                        className="block -ml-px border-l-2 border-transparent py-0.5 pl-3 text-sm text-text-muted transition-colors hover:border-primary hover:text-text-primary"
                      >
                        {heading.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            )}

            {guide.game_slug && (
              <div className="rounded-card border border-border-default bg-void-card p-5">
                <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold text-text-primary">
                  <BookOpen className="size-4 text-primary" />
                  Related Game
                </h2>
                <p className="mb-3 text-sm text-text-muted">{guide.game_title}</p>
                <Link
                  to={`/game/${guide.game_slug}`}
                  className="text-sm font-semibold text-primary transition-colors hover:text-primary-hover"
                >
                  View game page →
                </Link>
              </div>
            )}
          </aside>
        </div>

        {guide.related && guide.related.length > 0 && (
          <section className="flex flex-col gap-6">
            <SectionHeading title="Related Guides" />
            <Grid cols={4}>
              {guide.related.map((related) => (
                <GuideCard key={related.id} guide={related} />
              ))}
            </Grid>
          </section>
        )}
      </Container>
    </PageWrapper>
  )
}

export default GuideDetails
