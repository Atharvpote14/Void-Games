import { ArrowRight } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import Section from '@/layouts/Section/Section'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Grid from '@/layouts/Grid/Grid'
import GameCard from '@/components/cards/GameCard/GameCard'
import GameRow from '@/components/carousel/GameRow/GameRow'
import CardLoader from '@/components/loading/CardLoader/CardLoader'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import { Gamepad2 } from 'lucide-react'
import useFetch from '@/hooks/useFetch'

function GameSection({
  title,
  subtitle,
  fetcher,
  viewAllLink,
  layout = 'grid',
  limit = 8,
}) {
  const { data, loading, error, refetch } = useFetch(
    () => fetcher({ limit }),
    [fetcher, limit]
  )

  const games = Array.isArray(data) ? data : data?.games ?? []
  const isRow = layout === 'row'

  const action = viewAllLink ? (
    <Button to={viewAllLink} variant="ghost" size="sm">
      View All
      <ArrowRight className="size-4" />
    </Button>
  ) : null

  const renderContent = () => {
    if (loading) {
      return isRow ? (
        <div className="flex gap-4 overflow-hidden md:gap-6">
          {Array.from({ length: 5 }, (_, index) => (
            <div key={index} className="w-[160px] shrink-0 sm:w-[190px] md:w-[220px]">
              <CardLoader count={1} className="!grid-cols-1 !gap-0" />
            </div>
          ))}
        </div>
      ) : (
        <CardLoader count={Math.min(limit, 8)} />
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (games.length === 0) {
      return (
        <EmptyState
          icon={Gamepad2}
          title="No games yet"
          description="Games in this section will appear here soon."
        />
      )
    }

    if (isRow) {
      return <GameRow games={games} />
    }

    return (
      <Grid cols={4}>
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </Grid>
    )
  }

  return (
    <Section>
      <Container>
        <SectionHeading title={title} subtitle={subtitle} action={action} />
        {renderContent()}
      </Container>
    </Section>
  )
}

export default GameSection
