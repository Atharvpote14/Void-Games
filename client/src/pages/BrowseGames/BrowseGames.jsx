import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { X } from 'lucide-react'
import Container from '@/layouts/Container/Container'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import SortDropdown from '@/components/search/SortDropdown/SortDropdown'
import Pagination from '@/components/search/Pagination/Pagination'
import Grid from '@/layouts/Grid/Grid'
import GameCard from '@/components/cards/GameCard/GameCard'
import CardLoader from '@/components/loading/CardLoader/CardLoader'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import NoResults from '@/components/common/NoResults/NoResults'
import {
  FilterSidebar,
  FilterGroup,
  FilterOption,
} from '@/components/search/FilterSidebar/FilterSidebar'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { getGames } from '@/services/games'
import { getCategories } from '@/services/categories'
import { SORT_OPTIONS } from '@/constants/sorting'

function BrowseGames() {
  usePageMeta({
    title: 'Browse Games',
    description:
      'Browse the full Void Games library. Filter by category, sort by trending, latest, popular, and more.',
    path: '/games',
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'featured'
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const [searchInput, setSearchInput] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setSearchInput(query)
  }

  const { data: categoriesData, loading: categoriesLoading } =
    useFetch(getCategories)
  const categories = useMemo(
    () =>
      Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.categories ?? [],
    [categoriesData]
  )

  const { data, loading, error, refetch } = useFetch(
    () =>
      getGames({
        page,
        limit: 12,
        sort,
        search: query,
        category: category || undefined,
      }),
    [page, sort, query, category]
  )

  const games = Array.isArray(data) ? data : data?.games ?? []
  const totalPages = data?.total_pages || data?.totalPages || 1

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })
      next.delete('page')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  const handleSearch = (value) => {
    updateParams({ q: value?.trim() || '' })
  }

  const hasActiveFilters = Boolean(query || category) || sort !== 'featured'

  const handleClearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const handleCategoryToggle = (slug) => {
    updateParams({ category: category === slug ? '' : slug })
  }

  const activeCategory = useMemo(
    () => categories.find((item) => item.slug === category),
    [categories, category]
  )

  const breadcrumbItems = [
    { label: 'Home', path: '/' },
    { label: 'Games', path: '/games' },
  ]

  const renderContent = () => {
    if (loading) return <CardLoader count={12} />

    if (error) {
      return (
        <ErrorState
          title="Could not load games"
          onRetry={refetch}
        />
      )
    }

    if (games.length === 0) {
      return (
        <NoResults
          query={query}
          onClear={hasActiveFilters ? handleClearFilters : undefined}
        />
      )
    }

    return (
      <>
        <Grid cols={4}>
          {games.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </Grid>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(nextPage) => updateParams({ page: String(nextPage) })}
          className="mt-12"
        />
      </>
    )
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-8 md:py-12">
        <div className="flex flex-col gap-3">
          <Breadcrumb items={breadcrumbItems} />
          <h1 className="font-display text-[28px] font-extrabold text-text-primary md:text-[42px] md:leading-tight">
            Browse Games
          </h1>
          <p className="max-w-2xl text-sm text-text-muted md:text-base">
            Explore the full library of games with details, guides, fixes, and
            download mirrors.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onSearch={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search games..."
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Sort by</span>
            <SortDropdown
              value={sort}
              onChange={(value) => updateParams({ sort: value })}
              options={SORT_OPTIONS}
            />
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2">
            {query && (
              <button
                type="button"
                onClick={() => updateParams({ q: '' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
              >
                “{query}”
                <X className="size-3" />
              </button>
            )}
            {category && activeCategory && (
              <button
                type="button"
                onClick={() => updateParams({ category: '' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary/20"
              >
                {activeCategory.name}
                <X className="size-3" />
              </button>
            )}
            {sort !== 'featured' && (
              <button
                type="button"
                onClick={() => updateParams({ sort: 'featured' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-default bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {SORT_OPTIONS.find((option) => option.value === sort)?.label}
                <X className="size-3" />
              </button>
            )}
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <FilterSidebar
            onClear={handleClearFilters}
            hasActiveFilters={hasActiveFilters}
            className="h-fit lg:sticky lg:top-24"
          >
            <FilterGroup title="Categories">
              <div className="flex max-h-72 flex-col gap-1 overflow-y-auto pr-1">
                {categoriesLoading ? (
                  <p className="px-3 py-2 text-sm text-text-muted">Loading...</p>
                ) : (
                  categories.map((item) => (
                    <FilterOption
                      key={item.id}
                      label={item.name}
                      count={item.game_count}
                      active={category === item.slug}
                      onClick={() => handleCategoryToggle(item.slug)}
                    />
                  ))
                )}
              </div>
            </FilterGroup>
          </FilterSidebar>

          <div className="flex flex-col gap-6">{renderContent()}</div>
        </div>
      </Container>
    </PageWrapper>
  )
}

export default BrowseGames
