import { useState } from 'react'
import toast from 'react-hot-toast'
import RatingStars from '@/components/rating/RatingStars/RatingStars'
import Button from '@/components/buttons/Button/Button'
import { getGameRating, rateGame } from '@/services/ratings'
import useFetch from '@/hooks/useFetch'

function RatingSection({ gameId, user }) {
  const { data, refetch } = useFetch(() => getGameRating(gameId), [gameId])
  const [pendingRating, setPendingRating] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  const average = data?.average_rating ?? 0
  const count = data?.rating_count ?? 0
  const userRating = user ? data?.user_rating ?? null : null

  const handleRate = async (value) => {
    if (!user) {
      toast.error('Please login to rate this game.')
      return
    }
    setPendingRating(value)
    setSubmitting(true)
    try {
      await rateGame(gameId, value)
      toast.success(`Thanks! You rated this game ${value}/5.`)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not submit your rating.')
    } finally {
      setSubmitting(false)
      setPendingRating(0)
    }
  }

  return (
    <section
      aria-label="Rate this game"
      className="flex flex-col gap-3 rounded-card border border-border-default bg-void-card p-5"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-text-primary">
            {average > 0 ? average.toFixed(1) : '—'}
            <span className="ml-1 text-sm font-medium text-text-muted">/ 5</span>
          </h2>
          <p className="mt-1 text-xs text-text-muted">
            {count} rating{count !== 1 ? 's' : ''}
          </p>
        </div>
        <RatingStars value={userRating || pendingRating} size="lg" readonly={!user} />
      </div>
      <div className="flex items-center justify-between gap-3 border-t border-border-default pt-3">
        <p className="text-sm text-text-muted">
          {user ? 'Rate this game:' : 'Login to rate this game'}
        </p>
        <RatingStars
          value={0}
          size="md"
          onChange={handleRate}
          readonly={!user || submitting}
        />
      </div>
    </section>
  )
}

export default RatingSection
