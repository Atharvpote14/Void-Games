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
import GuideCard from '@/components/cards/GuideCard/GuideCard'
import CardLoader from '@/components/loading/CardLoader/CardLoader'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import NoResults from '@/components/common/NoResults/NoResults'
import CategoryChips from '@/components/category/CategoryChips/CategoryChips'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { getGuides, getGuideCategories } from '@/services/guides'
import { ARTICLE_SORT_OPTIONS } from '@/constants/sorting'

function Guides() {
  usePageMeta({
    title: 'Guides',
    description:
      'Step-by-step guides for installing, modding, and optimizing your favorite games.',
    path: '/guides',
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

  const { data: categoriesData } = useFetch(getGuideCategories)
  const categories = useMemo(
    () =>
      Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.categories ?? [],
    [categoriesData]
  )

  const { data, loading, error, refetch } = useFetch(
    () =>
      getGuides({
        page,
        limit: 12,
        sort,
        search: query,
        category: category || undefined,
      }),
    [page, sort, query, category]
  )

  const guides = Array.isArray(data) ? data : data?.guides ?? []
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

  const renderContent = () => {
    if (loading) return <CardLoader count={12} />

    if (error) {
      return <ErrorState title="Could not load guides" onRetry={refetch} />
    }

    if (guides.length === 0) {
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
          {guides.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
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
          <Breadcrumb
            items={[
              { label: 'Home', path: '/' },
              { label: 'Guides', path: '/guides' },
            ]}
          />
          <h1 className="font-display text-[28px] font-extrabold text-text-primary md:text-[42px] md:leading-tight">
            Game Guides
          </h1>
          <p className="max-w-2xl text-sm text-text-muted md:text-base">
            Step-by-step guides to install, mod, and optimize your favorite
            games.
          </p>
        </div>

        <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center md:justify-between">
          <SearchInput
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            onSearch={handleSearch}
            className="w-full md:max-w-md"
            placeholder="Search guides..."
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
            {category && (
              <button
                type="button"
                onClick={() => updateParams({ category: '' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary/20"
              >
                {category}
                <X className="size-3" />
              </button>
            )}
            {sort !== 'latest' && (
              <button
                type="button"
                onClick={() => updateParams({ sort: 'latest' })}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-border-default bg-white/5 px-3 py-1 text-xs font-medium text-text-secondary transition-colors hover:text-text-primary"
              >
                {ARTICLE_SORT_OPTIONS.find((option) => option.value === sort)
                  ?.label}
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

export default Guides
