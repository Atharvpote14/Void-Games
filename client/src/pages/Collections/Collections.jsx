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
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { getCollections, getGamesByCollection } from '@/services/collections'
import { ARTICLE_SORT_OPTIONS } from '@/constants/sorting'

function Collections() {
  usePageMeta({
    title: 'Collections',
    description: 'Curated collections of games handpicked by our community.',
    path: '/collections',
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'latest'
  const query = searchParams.get('q') || ''

  const [searchInput, setSearchInput] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setSearchInput(query)
  }

  const { data: collectionsData } = useFetch(getCollections)
  const allCollections = useMemo(
    () =>
      Array.isArray(collectionsData)
        ? collectionsData
        : collectionsData?.collections ?? [],
    [collectionsData]
  )

  const { data, loading, error, refetch } = useFetch(
    () =>
      getGamesByCollection({
        page,
        limit: 20,
        sort,
        search: query,
      }),
    [page, sort, query]
  )

  const games = Array.isArray(data) ? data : data?.games ?? []
  const totalPages = data?.pages || data?.total_pages || 1

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

  const hasActiveFilters = Boolean(query) || sort !== 'latest'

  const handleClearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const renderContent = () => {
    if (loading) return <CardLoader count={20} />

    if (error) {
      return <ErrorState title="Could not load games" onRetry={refetch} />
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
        <div className="flex flex-col gap-4 md:gap-6 mb-4" role="status" aria-live="polite">
          <p className="text-body-sm text-on-surface-muted">
            Showing {games.length} of {data?.total || data?.total_count || games.length} games
            {query && <span> for &ldquo;{query}&rdquo;</span>}
          </p>
          <Grid cols={5}>
            {games.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </Grid>
        </div>
        <Pagination
          page={page}
          totalPages={totalPages}
          onChange={(nextPage) => updateParams({ page: String(nextPage) })}
          className="mt-8"
        />
      </>
    )
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-8 md:py-12 animate-fade-in">
        <div className="flex flex-col gap-3 space-y-stack">
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Collections', path: '/collections' },
            ]}
          />
          <h1 className="text-display font-bold tracking-tight text-on-surface">Collections</h1>
          <p className="max-w-2xl text-body-lg text-on-surface-muted">
            Curated collections of games handpicked by our community.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onSearch={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search games..."
          />
          <div className="flex items-center gap-3">
            <span className="text-body-sm text-on-surface-muted">Sort by</span>
            <SortDropdown
              value={sort}
              onChange={(value) => updateParams({ sort: value })}
              options={ARTICLE_SORT_OPTIONS}
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {allCollections.map((collection) => (
            <a
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className="card p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors"
            >
              <h3 className="text-headline-sm font-semibold text-on-surface line-clamp-1">
                {collection.title}
              </h3>
              <p className="text-body-sm text-on-surface-muted line-clamp-2">
                {collection.description}
              </p>
              <span className="text-body-xs text-primary font-medium">
                View collection →
              </span>
            </a>
          ))}
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 animate-slide-down">
            {query && (
              <button
                type="button"
                onClick={() => updateParams({ q: '' })}
                className="badge badge-primary gap-1.5"
              >
                &ldquo;{query}&rdquo;
                <X className="size-3" />
              </button>
            )}
            {sort !== 'latest' && (
              <button
                type="button"
                onClick={() => updateParams({ sort: 'latest' })}
                className="badge badge-neutral gap-1.5"
              >
                {ARTICLE_SORT_OPTIONS.find((option) => option.value === sort)?.label}
                <X className="size-3" />
              </button>
            )}
          </div>
        )}

        <div className="flex flex-col gap-6">{renderContent()}</div>
      </Container>
    </PageWrapper>
  )
}

export default Collections