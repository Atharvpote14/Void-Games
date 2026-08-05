import { ArrowRight } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Container from '@/layouts/Container/Container'
import Section from '@/layouts/Section/Section'
import SectionHeading from '@/components/common/SectionHeading/SectionHeading'
import Grid from '@/layouts/Grid/Grid'
import CategoryCard from '@/components/cards/CategoryCard/CategoryCard'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import { LayoutGrid } from 'lucide-react'
import useFetch from '@/hooks/useFetch'
import { getCategories } from '@/services/categories'

function CategoriesSection() {
  const { data, loading, error, refetch } = useFetch(getCategories)

  const categories = Array.isArray(data) ? data : data?.categories ?? []

  const action = (
    <Button to="/categories" variant="ghost" size="sm">
      All Categories
      <ArrowRight className="size-4" />
    </Button>
  )

  const renderContent = () => {
    if (loading) {
      return (
        <Grid cols={4}>
          {Array.from({ length: 8 }, (_, index) => (
            <Skeleton key={index} className="h-36 rounded-card" />
          ))}
        </Grid>
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (categories.length === 0) {
      return (
        <EmptyState
          icon={LayoutGrid}
          title="No categories yet"
          description="Game categories will appear here soon."
        />
      )
    }

    return (
      <Grid cols={4}>
        {categories.slice(0, 8).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </Grid>
    )
  }

  return (
    <Section>
      <Container>
        <SectionHeading
          title="Browse by Category"
          subtitle="Find your next game by genre."
          action={action}
        />
        {renderContent()}
      </Container>
    </Section>
  )
}

export default CategoriesSection
