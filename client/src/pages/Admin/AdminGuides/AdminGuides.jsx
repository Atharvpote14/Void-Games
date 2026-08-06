import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import ArticleForm from '@/components/admin/ArticleForm/ArticleForm'
import Button from '@/components/buttons/Button/Button'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import Pagination from '@/components/search/Pagination/Pagination'
import Drawer from '@/components/modal/Drawer/Drawer'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { Link } from 'react-router-dom'
import { formatCompactNumber, formatDate } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  createAdminGuide,
  deleteAdminGuide,
  getAdminGuides,
  updateAdminGuide,
} from '@/services/admin'

function AdminGuides() {
  usePageMeta({ title: 'Admin Guides', description: 'Manage guides' })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const [searchInput, setSearchInput] = useState(search)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminGuides({
        page,
        limit: 10,
        search: search || undefined,
        sort: 'latest',
      }),
    [page, search]
  )

  const guides = data?.guides ?? []
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

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (guide) => {
    setEditing(guide)
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    refetch()
  }

  const handleSave = async (payload) => {
    if (editing) {
      await updateAdminGuide(editing.id, payload)
    } else {
      await createAdminGuide(payload)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminGuide(deleteTarget.id)
      setDeleteTarget(null)
      refetch()
    } catch {
      setDeleteTarget(null)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Guides"
        subtitle="Write and manage step-by-step game guides."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" />
            Add Guide
          </Button>
        }
      />

      <SearchInput
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onSearch={(value) => updateParams({ q: value?.trim() || '' })}
        className="w-full md:max-w-sm"
        placeholder="Search guides..."
      />

      {error ? (
        <ErrorState title="Could not load guides" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'guide', label: 'Guide' },
            { key: 'category', label: 'Category' },
            { key: 'views', label: 'Views' },
            { key: 'date', label: 'Updated' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No guides yet. Write your first guide."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => updateParams({ page: String(nextPage) })}
            />
          }
        >
          {guides.map((guide) => (
            <tr key={guide.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {guide.thumbnail ? (
                    <LazyImage
                      src={guide.thumbnail}
                      alt={guide.title}
                      className="size-11 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-default bg-void-bg-secondary font-display text-sm font-bold text-primary">
                      {(guide.title || 'G')[0]}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {guide.title}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {guide.game_title || guide.slug}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {guide.category || '—'}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatCompactNumber(guide.views)}
              </td>
              <td className="px-4 py-3 text-xs text-text-muted">
                {formatDate(guide.updated_at || guide.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/guide/${guide.slug}`}
                    aria-label={`View ${guide.title}`}
                    title="View on site"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEdit(guide)}
                    aria-label={`Edit ${guide.title}`}
                    title="Edit"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(guide)}
                    aria-label={`Delete ${guide.title}`}
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

      <Drawer
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title={editing ? 'Edit Guide' : 'Add Guide'}
        className="w-full max-w-2xl"
      >
        <ArticleForm
          kind="guide"
          article={editing}
          open={formOpen}
          onSave={async (payload) => {
            await handleSave(payload)
            handleSaved()
          }}
        />
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete guide?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete guide"
      />
    </div>
  )
}

export default AdminGuides
