import { useMemo } from 'react'
import { ExternalLink, ListOrdered, Rocket, Video } from 'lucide-react'
import Container from '@/layouts/Container/Container'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import CardLoader from '@/components/loading/CardLoader/CardLoader'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { getSteamFreeContent } from '@/services/steamFree'

function getYouTubeEmbedUrl(url) {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{6,})/
  )
  return match ? `https://www.youtube.com/embed/${match[1]}` : null
}

function isVideoFile(url) {
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url)
}

function VideoPlayer({ url }) {
  const embedUrl = useMemo(() => getYouTubeEmbedUrl(url), [url])

  if (embedUrl) {
    return (
      <div className="overflow-hidden rounded-card border border-border-default bg-void-card shadow-card">
        <div className="aspect-video w-full">
          <iframe
            src={embedUrl}
            title="Steam free games tutorial video"
            className="size-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (isVideoFile(url)) {
    return (
      <div className="overflow-hidden rounded-card border border-border-default bg-black shadow-card">
        <video
          src={url}
          controls
          playsInline
          className="aspect-video w-full"
        />
      </div>
    )
  }

  return null
}

function SteamFreeGames() {
  usePageMeta({
    title: 'Steam Free Games',
    description:
      'Step-by-step guide to claim free games on Steam, with direct links and a walkthrough video.',
    path: '/steam-free-games',
  })

  const { data, loading, error, refetch } = useFetch(getSteamFreeContent)

  const steps = Array.isArray(data?.steps) ? data.steps : []
  const videoUrl = data?.video_url || ''

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col gap-3">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Steam Free Games', path: '/steam-free-games' },
            ]}
          />
          <h1 className="font-display text-[28px] font-extrabold text-text-primary md:text-[42px] md:leading-tight">
            Steam Free Games
          </h1>
          <p className="max-w-2xl text-sm text-text-muted md:text-base">
            Follow the steps below to get free Steam games. Each step links
            directly to where you need to go — no searching required.
          </p>
        </div>

        {loading ? (
          <CardLoader count={3} />
        ) : error ? (
          <ErrorState title="Could not load this page" onRetry={refetch} />
        ) : (
          <div className="flex flex-col gap-10">
            {videoUrl && (
              <section className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-text-primary md:text-xl">
                  <Video className="size-5 text-primary" />
                  Watch the Video Guide
                </h2>
                <VideoPlayer url={videoUrl} />
              </section>
            )}

            {steps.length > 0 ? (
              <section className="flex flex-col gap-4">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-text-primary md:text-xl">
                  <ListOrdered className="size-5 text-primary" />
                  Step-by-Step Guide
                </h2>
                <ol className="flex flex-col gap-4">
                  {steps.map((step, index) => (
                    <li
                      key={step.id}
                      className="flex flex-col gap-4 rounded-card border border-border-default bg-void-card p-5 transition-all duration-300 hover:border-border-hover hover:shadow-card sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-start gap-4">
                        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-btn-gradient font-display text-base font-extrabold text-white shadow-btn">
                          {index + 1}
                        </span>
                        <div className="flex flex-col gap-1">
                          <h3 className="font-semibold text-text-primary">
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className="text-sm text-text-muted">
                              {step.description}
                            </p>
                          )}
                        </div>
                      </div>
                      {step.link_url && (
                        <a
                          href={step.link_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-btn bg-btn-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-btn transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110"
                        >
                          {step.link_label || 'Open Link'}
                          <ExternalLink className="size-4" />
                        </a>
                      )}
                    </li>
                  ))}
                </ol>
              </section>
            ) : (
              <div className="flex flex-col items-center gap-3 rounded-card border border-dashed border-border-default bg-void-card px-6 py-16 text-center">
                <Rocket className="size-10 text-text-muted" />
                <p className="text-sm text-text-muted">
                  Steps are being prepared — check back soon!
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </PageWrapper>
  )
}

export default SteamFreeGames
