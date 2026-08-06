import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  Flag,
  Globe,
  HardDrive,
  CalendarDays,
  Download,
  Eye,
  Video,
  ListChecks,
  Heart,
} from 'lucide-react'
import toast from 'react-hot-toast'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Grid from '@/layouts/Grid/Grid'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/buttons/Button/Button'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import Modal from '@/components/modal/Modal/Modal'
import GameCard from '@/components/cards/GameCard/GameCard'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import DownloadSection from '@/components/download/DownloadSection/DownloadSection'
import RatingSection from '@/components/rating/RatingSection/RatingSection'
import CommentSection from '@/components/comments/CommentSection/CommentSection'
import ReportModal from '@/components/reports/ReportModal/ReportModal'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { getGameBySlug, getGames } from '@/services/games'
import { formatBytes, formatDate, formatNumber } from '@/utils/formatters'

const FALLBACK_IMAGE = '/images/placeholder.svg'

function ScreenshotLightbox({ screenshots, index, onClose }) {
  const [current, setCurrent] = useState(index)

  return (
    <Modal
      open
      onClose={onClose}
      title={`Screenshot ${current + 1} of ${screenshots.length}`}
      size="lg"
    >
      <div className="flex flex-col gap-4">
        <div className="overflow-hidden rounded-card border border-border-default">
          <img
            src={screenshots[current]}
            alt={`Screenshot ${current + 1}`}
            className="aspect-video w-full object-cover"
          />
        </div>
        <div className="flex items-center justify-center gap-2">
          {screenshots.map((shot, shotIndex) => (
            <button
              key={shot}
              type="button"
              onClick={() => setCurrent(shotIndex)}
              aria-label={`Go to screenshot ${shotIndex + 1}`}
              className={`h-2 rounded-full transition-all ${
                shotIndex === current ? 'w-6 bg-primary' : 'w-2 bg-text-disabled'
              }`}
            />
          ))}
        </div>
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent((current - 1 + screenshots.length) % screenshots.length)}
          >
            Previous
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCurrent((current + 1) % screenshots.length)}
          >
            Next
          </Button>
        </div>
      </div>
    </Modal>
  )
}

function RequirementsBlock({ title, items }) {
  if (!items || items.length === 0) return null
  return (
    <div className="rounded-card border border-border-default bg-void-card p-5">
      <h3 className="mb-4 font-display text-base font-bold text-text-primary">
        {title}
      </h3>
      <ul className="flex flex-col gap-2.5">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex items-start justify-between gap-4 text-sm"
          >
            <span className="shrink-0 text-text-muted">{item.label}</span>
            <span className="text-right text-text-secondary">{item.value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GameDetails() {
  const { slug } = useParams()
  const { data: game, loading, error, refetch } = useFetch(
    () => getGameBySlug(slug),
    [slug]
  )

  const { data: relatedData } = useFetch(
    () =>
      getGames({
        genre_id: game?.genre_id,
        page_size: 4,
        page: 1,
        ...(game?.id ? { exclude_id: game.id } : {}),
      }),
    [game?.genre_id, game?.id],
    { enabled: Boolean(game) }
  )

  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [reportOpen, setReportOpen] = useState(false)
  const { user } = useAuth()
  const { isFavorite, toggleFavorite } = useFavorites()
  const [favoriteBusy, setFavoriteBusy] = useState(false)

  const handleToggleFavorite = async () => {
    if (!game) return
    if (!user) {
      toast.error('Sign in to save favorites')
      return
    }
    setFavoriteBusy(true)
    try {
      const added = await toggleFavorite(game)
      toast.success(added ? 'Added to favorites' : 'Removed from favorites')
    } catch {
      toast.error('Could not update favorites')
    } finally {
      setFavoriteBusy(false)
    }
  }

  usePageMeta({
    title: game ? `${game.title} – Void Games` : 'Game – Void Games',
    description: game?.short_description || game?.description?.slice(0, 160),
    image: game?.cover_image || FALLBACK_IMAGE,
  })

  const screenshots = useMemo(
    () =>
      Array.isArray(game?.screenshots)
        ? game.screenshots.map((shot) => shot?.url || shot)
        : [],
    [game]
  )

  const requirements = useMemo(() => {
    const raw = game?.system_requirements
    if (!raw || typeof raw !== 'object') return { minimum: [], recommended: [] }
    const map = (block) =>
      Object.entries(block || {}).map(([label, value]) => ({ label, value }))
    return {
      minimum: map(raw.minimum),
      recommended: map(raw.recommended),
    }
  }, [game])

  const relatedGames = relatedData?.games ?? relatedData?.results ?? []

  if (loading) {
    return (
      <PageWrapper>
        <Container size="xl" className="py-8">
          <div className="flex flex-col gap-6">
            <Skeleton className="aspect-video w-full rounded-card md:aspect-[21/9]" />
            <Skeleton className="h-9 w-2/3" />
            <Skeleton className="h-5 w-1/3" />
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-40 rounded-card" />
              <Skeleton className="h-40 rounded-card" />
            </div>
          </div>
        </Container>
      </PageWrapper>
    )
  }

  if (error || !game) {
    return (
      <PageWrapper>
        <Container size="xl" className="py-16">
          <ErrorState
            title="Game not found"
            description="The game you are looking for does not exist or has been removed."
            onRetry={refetch}
            action={
              <Button to="/games" variant="outline">
                Browse All Games
              </Button>
            }
          />
        </Container>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper>
      <Container size="xl" className="flex flex-col gap-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Games', path: '/games' },
            {
              label: game.genre?.name || 'All Games',
              path: `/games?category=${game.genre?.slug || ''}`,
            },
            { label: game.title },
          ]}
        />

        <section aria-label={`${game.title} banner`} className="relative">
          <div className="absolute inset-0 overflow-hidden rounded-card">
            <LazyImage
              src={game.banner_image || game.cover_image || FALLBACK_IMAGE}
              alt=""
              className="h-full w-full scale-105 object-cover blur-sm brightness-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void-bg via-void-bg/60 to-transparent" />
          </div>
          <div className="relative flex flex-col gap-6 p-6 md:p-10 lg:flex-row lg:items-end lg:gap-10">
            <div className="w-48 shrink-0 overflow-hidden rounded-card border border-border-default shadow-card md:w-60 lg:w-64">
              <LazyImage
                src={game.cover_image || FALLBACK_IMAGE}
                alt={`${game.title} cover`}
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <h1 className="font-display text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
                {game.title}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {game.genre && (
                  <Badge tone="primary">
                    <Link to={`/games?category=${game.genre.slug}`} className="hover:underline">
                      {game.genre.name}
                    </Link>
                  </Badge>
                )}
                {(game.badges || []).map((badge) => {
                  const lower = badge.toLowerCase()
                  const tone =
                    lower === 'open world'
                      ? 'success'
                      : lower === 'featured'
                        ? 'secondary'
                        : 'neutral'
                  return (
                    <Badge key={badge} tone={tone}>
                      {badge}
                    </Badge>
                  )
                })}
                {game.is_featured &&
                  !(game.badges || []).some(
                    (badge) => badge.toLowerCase() === 'featured'
                  ) && <Badge tone="secondary">Featured</Badge>}
                {game.is_trending && <Badge tone="gold">Trending</Badge>}
              </div>
              {game.short_description && (
                <p className="max-w-2xl text-sm leading-relaxed text-text-secondary md:text-base">
                  {game.short_description}
                </p>
              )}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
                {game.game_size && (
                  <span className="inline-flex items-center gap-1.5">
                    <HardDrive className="size-4" /> {formatBytes(game.game_size)}
                  </span>
                )}
                {game.version && (
                  <span className="inline-flex items-center gap-1.5">
                    <ListChecks className="size-4" /> v{game.version}
                  </span>
                )}
                {game.release_date && (
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-4" /> {formatDate(game.release_date)}
                  </span>
                )}
                {game.download_count > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Download className="size-4" /> {formatNumber(game.download_count)} downloads
                  </span>
                )}
                {game.view_count > 0 && (
                  <span className="inline-flex items-center gap-1.5">
                    <Eye className="size-4" /> {formatNumber(game.view_count)} views
                  </span>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button to="#downloads" size="lg">
                  <Download className="size-5" />
                  Download Now
                </Button>
                <Button
                  variant={isFavorite(game.id) ? 'primary' : 'outline'}
                  size="lg"
                  onClick={handleToggleFavorite}
                  loading={favoriteBusy}
                >
                  <Heart
                    className={`size-4.5 ${
                      isFavorite(game.id) ? 'fill-current' : ''
                    }`}
                  />
                  {isFavorite(game.id) ? 'Saved' : 'Save'}
                </Button>
                {game.video_url && (
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setLightboxIndex('trailer')}
                  >
                    <Video className="size-5" />
                    Watch Trailer
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setReportOpen(true)}
                >
                  <Flag className="size-4" />
                  Report
                </Button>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex min-w-0 flex-col gap-10">
            <section aria-label="About this game" className="flex flex-col gap-4">
              <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
                About This Game
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-text-secondary md:text-base">
                {game.description}
              </p>
            </section>

            {screenshots.length > 0 && (
              <section aria-label="Screenshots" className="flex flex-col gap-4">
                <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
                  Screenshots
                </h2>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {screenshots.map((shot, index) => (
                    <button
                      key={shot}
                      type="button"
                      onClick={() => setLightboxIndex(index)}
                      aria-label={`View screenshot ${index + 1}`}
                      className="group relative overflow-hidden rounded-card border border-border-default"
                    >
                      <LazyImage
                        src={shot}
                        alt={`${game.title} screenshot ${index + 1}`}
                        className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </button>
                  ))}
                </div>
              </section>
            )}

            {game.features?.length > 0 && (
              <section aria-label="Features" className="flex flex-col gap-4">
                <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
                  Features
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {game.features.map((feature) => (
                    <div
                      key={feature}
                      className="flex items-center gap-2.5 rounded-card border border-border-default bg-void-card px-4 py-3 text-sm text-text-secondary"
                    >
                      <span className="grid size-5 shrink-0 place-items-center rounded-full bg-primary/15 text-xs text-primary">
                        ✓
                      </span>
                      {feature}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {game.installation_instructions && (
              <section aria-label="Installation" className="flex flex-col gap-4">
                <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
                  Installation Guide
                </h2>
                <ol className="flex flex-col gap-3">
                  {String(game.installation_instructions)
                    .split(/\n+/)
                    .filter(Boolean)
                    .map((step, index) => (
                      <li
                        key={step}
                        className="flex gap-3.5 rounded-card border border-border-default bg-void-card p-4 text-sm leading-relaxed text-text-secondary"
                      >
                        <span className="grid size-6 shrink-0 place-items-center rounded-full bg-btn-gradient text-xs font-bold text-white">
                          {index + 1}
                        </span>
                        {step}
                      </li>
                    ))}
                </ol>
              </section>
            )}

            <div id="downloads" className="scroll-mt-24">
              <DownloadSection
                gameId={game.id}
                game={game}
                mirrors={game.download_links || []}
              />
            </div>

            <CommentSection gameId={game.id} user={null} />
          </div>

          <aside className="flex min-w-0 flex-col gap-5 lg:sticky lg:top-24 lg:self-start">
            <RatingSection gameId={game.id} user={null} />

            {(requirements.minimum.length > 0 ||
              requirements.recommended.length > 0) && (
              <section
                aria-label="System requirements"
                className="flex flex-col gap-4"
              >
                <h2 className="font-display text-lg font-bold text-text-primary">
                  System Requirements
                </h2>
                <RequirementsBlock title="Minimum" items={requirements.minimum} />
                <RequirementsBlock
                  title="Recommended"
                  items={requirements.recommended}
                />
              </section>
            )}

            {game.website_url && (
              <Button
                variant="outline"
                onClick={() => window.open(game.website_url, '_blank', 'noopener')}
              >
                <Globe className="size-4" />
                Official Website
              </Button>
            )}
          </aside>
        </div>

        {relatedGames.length > 0 && (
          <section aria-label="Related games" className="flex flex-col gap-6">
            <SectionHeading
              title="More in This Category"
              action={
                <Button
                  to={`/games?category=${game.genre?.slug || ''}`}
                  variant="ghost"
                  size="sm"
                >
                  View All
                </Button>
              }
            />
            <Grid cols={4}>
              {relatedGames.map((related) => (
                <GameCard key={related.id} game={related} />
              ))}
            </Grid>
          </section>
        )}
      </Container>

      {lightboxIndex === 'trailer' && game.video_url && (
        <Modal
          open
          onClose={() => setLightboxIndex(null)}
          title={`${game.title} – Trailer`}
          size="lg"
        >
          <div className="overflow-hidden rounded-card border border-border-default">
            <video
              src={game.video_url}
              controls
              className="aspect-video w-full bg-black"
              autoPlay
            />
          </div>
        </Modal>
      )}

      {Number.isInteger(lightboxIndex) && screenshots[lightboxIndex] && (
        <ScreenshotLightbox
          screenshots={screenshots}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}

      <ReportModal
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        gameId={game.id}
      />
    </PageWrapper>
  )
}

export default GameDetails

