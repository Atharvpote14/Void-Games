import { ArrowRight } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import Section from '@/layouts/Section/Section'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Grid from '@/layouts/Grid/Grid'
import CollectionCard from '@/components/cards/CollectionCard/CollectionCard'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import { Layers } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { getCollections } from '@/services/collections'

function CollectionsSection() {
  const { data, loading, error, refetch } = useFetch(getCollections)

  const collections = Array.isArray(data) ? data : data?.collections ?? []

  const action = (
    <Button to="/collections" variant="ghost" size="sm">
      All Collections
      <ArrowRight className="size-4" />
    </Button>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <Grid cols={2}>
          {Array.from({ length: 2 }, (_, index) => (
            <Skeleton key={index} className="aspect-[16/9] rounded-card" />
          ))}
        </Grid>
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (collections.length === 0) {
      return (
        <EmptyState
          icon={Layers}
          title="No collections yet"
          description="Curated collections will appear here soon."
        />
      )
    }

    return (
      <Grid cols={2}>
        {collections.slice(0, 2).map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </Grid>
    )
  }

  return (
    <Section className="bg-void-bg-secondary/40">
      <Container>
        <SectionHeading
          title="Popular Collections"
          subtitle="Handpicked sets of games worth exploring."
          action={action}
        />
        {renderContent()}
      </Container>
    </Section>
  )
}

export default CollectionsSection
