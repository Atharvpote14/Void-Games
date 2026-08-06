import { useCallback, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, Pencil, Plus, Star, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import Button from '@/components/buttons/Button/Button'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import Select from '@/components/inputs/Select/Select'
import Pagination from '@/components/search/Pagination/Pagination'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { Link } from 'react-router-dom'
import { formatCompactNumber, formatDate } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { deleteAdminGame, getAdminGames } from '@/services/admin'

const STATUS_OPTIONS = [
  { label: 'All statuses', value: '' },
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
]

function AdminGames() {
  usePageMeta({ title: 'Admin Games', description: 'Manage games' })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const status = searchParams.get('status') || ''
  const [searchInput, setSearchInput] = useState(search)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminGames({
        page,
        limit: 10,
        search: search || undefined,
        status: status || undefined,
        sort: 'latest',
      }),
    [page, search, status]
  )

  const games = data?.games ?? []
  const totalPages = data?.totalPages || data?.total_pages || 1

  const updateParams = useCallback(
    (updates) => {
      const next = new URLSearchParams(searchParams)
      Object.entries(updates).forEach(([key, value]) => {
        if (!value) next.delete(key)
        else next.set(key, value)
      })
      next.delete('page')
      setSearchParams(next)
    },
    [searchParams, setSearchParams]
  )

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminGame(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch {
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  const columns = useMemo(
    () => [
      { key: 'game', label: 'Game' },
      { key: 'category', label: 'Category' },
      { key: 'version', label: 'Version' },
      { key: 'downloads', label: 'Downloads' },
      { key: 'views', label: 'Views' },
      { key: 'featured', label: 'Featured' },
      { key: 'status', label: 'Status' },
      { key: 'date', label: 'Added' },
      { key: 'actions', label: 'Actions' },
    ],
    []
  )

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Games"
        subtitle="Create, edit, and manage every game on the platform."
        actions={
          <Button to="/admin/games/new" size="sm">
            <Plus className="size-4" />
            Add Game
          </Button>
        }
      />

      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <SearchInput
          value={searchInput}
          onChange={(event) => setSearchInput(event.target.value)}
          onSearch={(value) => updateParams({ q: value?.trim() || '' })}
          className="w-full md:max-w-sm"
          placeholder="Search games..."
        />
        <Select
          value={status}
          onChange={(event) => updateParams({ status: event.target.value })}
          options={STATUS_OPTIONS}
          className="md:w-44"
          aria-label="Filter by status"
        />
      </div>

      {error ? (
        <ErrorState title="Could not load games" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={columns}
          loading={loading}
          emptyText="No games found. Add your first game."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => updateParams({ page: String(nextPage) })}
            />
          }
        >
          {games.map((game) => (
            <tr key={game.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <LazyImage
                    src={game.cover_image}
                    alt={game.title}
                    className="size-11 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {game.title}
                    </p>
                    <p className="truncate text-xs text-text-muted">{game.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {game.genre?.name ?? '—'}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {game.version || '—'}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatCompactNumber(game.downloads)}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatCompactNumber(game.views)}
              </td>
              <td className="px-4 py-3">
                {game.is_featured ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-gold">
                    <Star className="size-3.5 fill-current" />
                    Featured
                  </span>
                ) : (
                  <span className="text-xs text-text-disabled">—</span>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge
                  active={game.is_active}
                  label={game.is_active ? 'Active' : 'Inactive'}
                />
              </td>
              <td className="px-4 py-3 text-xs text-text-muted">
                {formatDate(game.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/game/${game.slug}`}
                    aria-label={`View ${game.title}`}
                    title="View on site"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </Link>
                  <Link
                    to={`/admin/games/${game.id}/edit`}
                    aria-label={`Edit ${game.title}`}
                    title="Edit"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Pencil className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(game)}
                    aria-label={`Delete ${game.title}`}
                    title="Delete"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      )}

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete game?"
        description={`"${deleteTarget?.title}" and all of its links, screenshots, ratings, and comments will be permanently removed.`}
        confirmLabel="Delete game"
      />
    </div>
  )
}

export default AdminGames
