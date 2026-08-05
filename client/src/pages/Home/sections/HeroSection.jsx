import { useEffect, useState } from 'react'
import { Gamepad2 } from 'lucide-react'
import HeroSlider from '@/components/hero/HeroSlider/HeroSlider'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { getFeaturedGames, getTrendingGames } from '@/services/games'

function HeroSection() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      try {
        const featured = await getFeaturedGames({ limit: 6 })
        if (cancelled) return
        const featuredList = Array.isArray(featured)
          ? featured
          : featured?.games ?? []
        if (featuredList.length > 0) {
          setError(null)
          setGames(featuredList)
          return
        }
        const trending = await getTrendingGames({ limit: 6 })
        if (cancelled) return
        setError(null)
        setGames(Array.isArray(trending) ? trending : trending?.games ?? [])
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [tick])

  const handleRetry = () => {
    setLoading(true)
    setTick((prev) => prev + 1)
  }

  if (loading) {
    return (
      <div className="border-b border-border-default bg-hero-gradient">
        <Skeleton className="h-[420px] w-full rounded-none border-0 bg-transparent md:h-[560px]" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="border-b border-border-default bg-hero-gradient px-4 py-16">
        <div className="mx-auto max-w-xl">
          <ErrorState
            title="Could not load featured games"
            description="The featured games could not be loaded right now."
            onRetry={handleRetry}
          />
        </div>
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="flex items-center gap-3 border-b border-border-default bg-hero-gradient px-4 py-20 md:py-28">
        <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
          <div className="grid size-14 place-items-center rounded-2xl border border-border-default bg-white/5">
            <Gamepad2 className="size-6 text-text-muted" />
          </div>
          <h2 className="font-display text-xl font-bold text-text-primary">
            Welcome to Void Games
          </h2>
          <p className="text-sm text-text-muted">
            Featured games will appear here as soon as they are added.
          </p>
        </div>
      </div>
    )
  }

  return <HeroSlider games={games} />
}

export default HeroSection
