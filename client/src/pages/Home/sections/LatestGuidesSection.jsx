import { ArrowRight } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import Section from '@/layouts/Section/Section'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Grid from '@/layouts/Grid/Grid'
import GuideCard from '@/components/cards/GuideCard/GuideCard'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import { BookOpen } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { getGuides } from '@/services/guides'

function LatestGuidesSection() {
  const { data, loading, error, refetch } = useFetch(() => getGuides({ limit: 4 }))

  const guides = Array.isArray(data) ? data : data?.guides ?? []

  const action = (
    <Button to="/guides" variant="ghost" size="sm">
      All Guides
      <ArrowRight className="size-4" />
    </Button>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <Grid cols={4}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-64 rounded-card" />
          ))}
        </Grid>
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (guides.length === 0) {
      return (
        <EmptyState
          icon={BookOpen}
          title="No guides yet"
          description="Guides will appear here as they are published."
        />
      )
    }

    return (
      <Grid cols={4}>
        {guides.map((guide) => (
          <GuideCard key={guide.id} guide={guide} />
        ))}
      </Grid>
    )
  }

  return (
    <Section>
      <Container>
        <SectionHeading
          title="Latest Guides"
          subtitle="Tips, walkthroughs, and performance guides."
          action={action}
        />
        {renderContent()}
      </Container>
    </Section>
  )
}

export default LatestGuidesSection
