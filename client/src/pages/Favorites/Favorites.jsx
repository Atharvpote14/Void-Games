import { Heart, HeartOff } from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Grid from '@/layouts/Grid/Grid'
import GameCard from '@/components/cards/GameCard/GameCard'
import GameCardSkeleton from '@/components/loading/GameCardSkeleton/GameCardSkeleton'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import Button from '@/components/buttons/Button/Button'
import usePageMeta from '@/hooks/usePageMeta'
import { useFavorites } from '@/hooks/useFavorites'

function Favorites() {
  usePageMeta({ title: 'Favorites', path: '/favorites' })
  const { favorites, loading } = useFavorites()

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Favorites
          </h1>
          <p className="text-sm text-text-muted">
            Games you have saved for later. Tap the heart on any game page to
            add or remove favorites.
          </p>
        </div>

        {loading ? (
          <Grid cols={4}>
            {Array.from({ length: 8 }).map((_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </Grid>
        ) : favorites.length === 0 ? (
          <EmptyState
            icon={HeartOff}
            title="No favorites yet"
            description="When you find a game you love, hit the heart button to keep it here."
            action={
              <Button to="/games">
                <Heart className="size-4" />
                Browse Games
              </Button>
            }
          />
        ) : (
          <Grid cols={4}>
            {favorites.map((favorite) => (
              <GameCard
                key={favorite.game_id}
                game={{
                  id: favorite.game_id,
                  title: favorite.game_title,
                  slug: favorite.game_slug,
                  cover_image: favorite.game_cover,
                }}
              />
            ))}
          </Grid>
        )}
      </Container>
    </PageWrapper>
  )
}

export default Favorites
