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
import FixCard from '@/components/cards/FixCard/FixCard'
import CardLoader from '@/components/loading/CardLoader/CardLoader'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import NoResults from '@/components/common/NoResults/NoResults'
import CategoryChips from '@/components/category/CategoryChips/CategoryChips'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { getFixes, getFixCategories } from '@/services/fixes'
import { ARTICLE_SORT_OPTIONS } from '@/constants/sorting'

function FixCenter() {
  usePageMeta({
    title: 'Fix Center',
    description:
      'Troubleshooting guides for common game problems. Find solutions for crashes, low FPS, launcher errors, and more.',
    path: '/fixes',
  })

  const [searchParams, setSearchParams] = useSearchParams()

  const page = Number(searchParams.get('page')) || 1
  const sort = searchParams.get('sort') || 'latest'
  const query = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''

  const [searchInput, setSearchInput] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setSearchInput(query)
  }

  const { data: categoriesData } = useFetch(getFixCategories)
  const categories = useMemo(
    () =>
      Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.categories ?? [],
    [categoriesData]
  )

  const { data, loading, error, refetch } = useFetch(
    () =>
      getFixes({
        page,
        limit: 12,
        sort,
        search: query,
        category: category || undefined,
      }),
    [page, sort, query, category]
  )

  const fixes = Array.isArray(data) ? data : data?.fixes ?? []
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

  const hasActiveFilters = Boolean(query || category) || sort !== 'latest'

  const handleClearFilters = () => {
    setSearchParams({})
    setSearchInput('')
  }

  const activeCategory = useMemo(
    () => categories.find((item) => item.slug === category),
    [categories, category]
  )

  const renderContent = () => {
    if (loading) return <CardLoader count={12} />

    if (error) {
      return <ErrorState title="Could not load fixes" onRetry={refetch} />
    }

    if (fixes.length === 0) {
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
          <p className="text-sm text-text-muted">
            Showing {fixes.length} of {data?.total || data?.total_count || fixes.length} fixes
            {query && <span> for &ldquo;{query}&rdquo;</span>}
            {category && <span> in {activeCategory?.name}</span>}
          </p>
          <Grid cols={4}>
            {fixes.map((fix) => (
              <FixCard key={fix.id} fix={fix} />
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
              { label: 'Fix Center', path: '/fixes' },
            ]}
          />
          <h1 className="heading-2">Fix Center</h1>
          <p className="max-w-2xl text-body">
            Search for solutions to common game problems. Fixes are written and
            verified by our community of gamers.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onSearch={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search problems, games, solutions... ⌘K"
          />
          <div className="flex items-center gap-3">
            <span className="text-sm text-text-muted">Sort by</span>
            <SortDropdown
              value={sort}
              onChange={(value) => updateParams({ sort: value })}
              options={ARTICLE_SORT_OPTIONS}
            />
          </div>
        </div>

        <CategoryChips
          categories={categories}
          active={category}
          onSelect={(value) => updateParams({ category: value })}
        />

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
            {category && activeCategory && (
              <button
                type="button"
                onClick={() => updateParams({ category: '' })}
                className="badge badge-secondary gap-1.5"
              >
                {activeCategory.name}
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

export default FixCenter