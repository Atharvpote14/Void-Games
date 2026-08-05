import { ArrowRight } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import Section from '@/layouts/Section/Section'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Grid from '@/layouts/Grid/Grid'
import FixCard from '@/components/cards/FixCard/FixCard'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import { Wrench } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { getFixes } from '@/services/fixes'

function LatestFixesSection() {
  const { data, loading, error, refetch } = useFetch(() => getFixes({ limit: 4 }))

  const fixes = Array.isArray(data) ? data : data?.fixes ?? []

  const action = (
    <Button to="/fixes" variant="ghost" size="sm">
      Fix Center
      <ArrowRight className="size-4" />
    </Button>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <Grid cols={4}>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-44 rounded-card" />
          ))}
        </Grid>
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (fixes.length === 0) {
      return (
        <EmptyState
          icon={Wrench}
          title="No fixes yet"
          description="Troubleshooting guides will appear here soon."
        />
      )
    }

    return (
      <Grid cols={4}>
        {fixes.map((fix) => (
          <FixCard key={fix.id} fix={fix} />
        ))}
      </Grid>
    )
  }

  return (
    <Section className="bg-void-bg-secondary/40">
      <Container>
        <SectionHeading
          title="Latest Fixes"
          subtitle="Solutions to common crashes, errors, and performance issues."
          action={action}
        />
        {renderContent()}
      </Container>
    </Section>
  )
}

export default LatestFixesSection
