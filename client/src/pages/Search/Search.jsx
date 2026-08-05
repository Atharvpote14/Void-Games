import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Search, X } from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Breadcrumb from '@/components/common/Breadcrumb/Breadcrumb'
import TextInput from '@/components/inputs/TextInput/TextInput'
import Button from '@/components/buttons/Button/Button'
import Pagination from '@/components/search/Pagination/Pagination'
import GameCard from '@/components/cards/GameCard/GameCard'
import GameCardSkeleton from '@/components/loading/GameCardSkeleton/GameCardSkeleton'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { searchGames } from '@/services/search'

const PAGE_SIZE = 12

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const query = searchParams.get('q') || ''
  const page = Math.max(1, Number(searchParams.get('page')) || 1)
  const [input, setInput] = useState(query)
  const [prevQuery, setPrevQuery] = useState(query)
  if (query !== prevQuery) {
    setPrevQuery(query)
    setInput(query)
  }

  const { data, loading, error, refetch } = useFetch(
    () => searchGames({ q: query, page, page_size: PAGE_SIZE }),
    [query, page]
  )

  usePageMeta({
    title: query
      ? `Search: ${query} – Void Games`
      : 'Search – Void Games',
    description: 'Search all PC games, guides and fixes on Void Games.',
  })

  const games = data?.games ?? data?.results ?? []
  const totalPages = Math.max(1, Math.ceil((data?.total_count ?? games.length) / PAGE_SIZE))

  const handleSubmit = (event) => {
    event.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    setSearchParams({ q: trimmed, page: '1' })
  }

  const clearSearch = () => {
    setInput('')
    navigate('/search')
  }

  return (
    <PageWrapper>
      <Container size="xl" className="flex flex-col gap-8 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', path: '/' },
            { label: 'Search', path: '/search' },
            ...(query ? [{ label: query }] : []),
          ]}
        />

        <div className="flex flex-col gap-3">
          <h1 className="font-display text-2xl font-extrabold text-text-primary md:text-3xl">
            Search Games
          </h1>
          <form onSubmit={handleSubmit} className="flex max-w-2xl gap-2">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-text-disabled" />
              <TextInput
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Search games, guides, fixes..."
                aria-label="Search"
                inputClassName="pl-11 pr-10"
              />
              {input && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-text-disabled transition-colors hover:text-text-primary"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Button type="submit">Search</Button>
          </form>
        </div>

        {query && (
          <p className="text-sm text-text-muted">
            {loading
              ? `Searching for "${query}"...`
              : `${data?.total_count ?? games.length} result${games.length === 1 ? '' : 's'} for "${query}"`}
          </p>
        )}

        {loading ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, index) => (
              <GameCardSkeleton key={index} />
            ))}
          </div>
        ) : error ? (
          <ErrorState onRetry={refetch} />
        ) : games.length === 0 ? (
          <EmptyState
            title={query ? 'No results found' : 'Start searching'}
            description={
              query
                ? `Nothing matched "${query}". Try a different keyword.`
                : 'Type a game name above to search the library.'
            }
            action={
              query && (
                <Button variant="outline" onClick={clearSearch}>
                  Clear Search
                </Button>
              )
            }
          />
        ) : (
          <div className="flex flex-col gap-8">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {games.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </div>
            {totalPages > 1 && (
              <Pagination
                page={page}
                totalPages={totalPages}
                onChange={(nextPage) =>
                  setSearchParams({ q: query, page: String(nextPage) })
                }
              />
            )}
          </div>
        )}
      </Container>
    </PageWrapper>
  )
}

export default SearchPage
