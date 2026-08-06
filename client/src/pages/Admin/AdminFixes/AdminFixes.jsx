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
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { Link } from 'react-router-dom'
import { formatCompactNumber, formatDate } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  createAdminFix,
  deleteAdminFix,
  getAdminFixes,
  updateAdminFix,
} from '@/services/admin'

function AdminFixes() {
  usePageMeta({ title: 'Admin Fix Center', description: 'Manage game fixes' })

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
      getAdminFixes({
        page,
        limit: 10,
        search: search || undefined,
        sort: 'latest',
      }),
    [page, search]
  )

  const fixes = data?.fixes ?? []
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

  const openEdit = (fix) => {
    setEditing(fix)
    setFormOpen(true)
  }

  const handleSave = async (payload) => {
    if (editing) {
      await updateAdminFix(editing.id, payload)
    } else {
      await createAdminFix(payload)
    }
  }

  const handleSaved = () => {
    setFormOpen(false)
    refetch()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminFix(deleteTarget.id)
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
        title="Fix Center"
        subtitle="Document problems, symptoms, and step-by-step solutions."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" />
            Add Fix
          </Button>
        }
      />

      <SearchInput
        value={searchInput}
        onChange={(event) => setSearchInput(event.target.value)}
        onSearch={(value) => updateParams({ q: value?.trim() || '' })}
        className="w-full md:max-w-sm"
        placeholder="Search fixes..."
      />

      {error ? (
        <ErrorState title="Could not load fixes" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'fix', label: 'Fix' },
            { key: 'game', label: 'Game' },
            { key: 'views', label: 'Views' },
            { key: 'date', label: 'Updated' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No fixes yet. Add your first fix."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(nextPage) => updateParams({ page: String(nextPage) })}
            />
          }
        >
          {fixes.map((fix) => (
            <tr key={fix.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <p className="truncate font-medium text-text-primary">{fix.title}</p>
                <p className="truncate text-xs text-text-muted">{fix.slug}</p>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {fix.game_title || '—'}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {formatCompactNumber(fix.views)}
              </td>
              <td className="px-4 py-3 text-xs text-text-muted">
                {formatDate(fix.updated_at || fix.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <Link
                    to={`/fix/${fix.slug}`}
                    aria-label={`View ${fix.title}`}
                    title="View on site"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => openEdit(fix)}
                    aria-label={`Edit ${fix.title}`}
                    title="Edit"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(fix)}
                    aria-label={`Delete ${fix.title}`}
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
        title={editing ? 'Edit Fix' : 'Add Fix'}
        className="w-full max-w-2xl"
      >
        <ArticleForm
          kind="fix"
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
        title="Delete fix?"
        description={`"${deleteTarget?.title}" will be permanently removed.`}
        confirmLabel="Delete fix"
      />
    </div>
  )
}

export default AdminFixes
