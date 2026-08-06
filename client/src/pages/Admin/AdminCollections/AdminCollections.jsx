import { useCallback, useState } from 'react'
import { ImageOff, Pencil, Plus, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Toggle from '@/components/inputs/Toggle/Toggle'
import Checkbox from '@/components/inputs/Checkbox/Checkbox'
import Drawer from '@/components/modal/Drawer/Drawer'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { slugify } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  createAdminCollection,
  deleteAdminCollection,
  getAdminCollections,
  getAdminGamePicker,
  updateAdminCollection,
} from '@/services/admin'

const EMPTY_FORM = {
  title: '',
  slug: '',
  description: '',
  thumbnail: '',
  is_active: true,
  game_ids: [],
}

function CollectionForm({ open, onClose, collection, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formKey, setFormKey] = useState({ open, collection })

  if (open !== formKey.open || collection !== formKey.collection) {
    setFormKey({ open, collection })
    if (open) {
      setError('')
      setSlugTouched(Boolean(collection))
      setForm(
        collection
          ? {
              title: collection.title,
              slug: collection.slug,
              description: collection.description || '',
              thumbnail: collection.thumbnail || '',
              is_active: collection.is_active !== false,
              game_ids: collection.game_ids || [],
            }
          : EMPTY_FORM
      )
    }
  }

  const { data: pickerData } = useFetch(getAdminGamePicker, [], {
    enabled: open,
  })
  const games =
    Array.isArray(pickerData) ? pickerData : (pickerData?.games ?? [])

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleTitleChange = (value) => {
    setField('title', value)
    if (!slugTouched) setField('slug', slugify(value))
  }

  const toggleGame = (gameId) => {
    setForm((prev) => {
      const selected = prev.game_ids.includes(gameId)
        ? prev.game_ids.filter((id) => id !== gameId)
        : [...prev.game_ids, gameId]
      return { ...prev, game_ids: selected }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Title is required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        game_ids: form.game_ids,
      }
      if (collection) {
        await updateAdminCollection(collection.id, payload)
      } else {
        await createAdminCollection(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={collection ? 'Edit Collection' : 'Add Collection'}
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <TextInput
          label="Title"
          required
          value={form.title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder="e.g. Best Open World Games"
        />
        <TextInput
          label="Slug"
          value={form.slug}
          onChange={(event) => {
            setSlugTouched(true)
            setField('slug', event.target.value)
          }}
          placeholder="best-open-world-games"
        />
        <TextInput
          label="Banner / Thumbnail URL"
          value={form.thumbnail}
          onChange={(event) => setField('thumbnail', event.target.value)}
          placeholder="https://..."
        />
        <TextArea
          label="Description"
          rows={3}
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
        />
        <Toggle
          label="Active"
          description="Inactive collections are hidden on the public site."
          checked={form.is_active}
          onChange={(event) => setField('is_active', event.target.checked)}
        />

        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium text-text-secondary">
            Games in this collection ({form.game_ids.length})
          </span>
          <div className="max-h-64 overflow-y-auto rounded-card border border-border-default p-2">
            {games.length === 0 ? (
              <p className="px-3 py-4 text-sm text-text-muted">
                No games available yet.
              </p>
            ) : (
              games.map((game) => (
                <Checkbox
                  key={game.id}
                  label={game.title}
                  checked={form.game_ids.includes(game.id)}
                  onChange={() => toggleGame(game.id)}
                  className="rounded-lg px-2 py-1.5 hover:bg-white/5"
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {collection ? 'Save Changes' : 'Create Collection'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

function AdminCollections() {
  usePageMeta({ title: 'Admin Collections', description: 'Manage game collections' })

  const { data, loading, error, refetch } = useFetch(getAdminCollections)
  const collections =
    Array.isArray(data) ? data : (data?.collections ?? [])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (collection) => {
    setEditing(collection)
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    refetch()
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminCollection(deleteTarget.id)
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
        title="Collections"
        subtitle="Curated bundles of games featured on the homepage."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" />
            Add Collection
          </Button>
        }
      />

      {error ? (
        <ErrorState title="Could not load collections" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'collection', label: 'Collection' },
            { key: 'games', label: 'Games' },
            { key: 'status', label: 'Status' },
            { key: 'created', label: 'Created' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No collections yet. Create your first one."
        >
          {collections.map((collection) => (
            <tr key={collection.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {collection.thumbnail ? (
                    <LazyImage
                      src={collection.thumbnail}
                      alt={collection.title}
                      className="size-11 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-default bg-void-bg-secondary text-text-muted">
                      <ImageOff className="size-5" />
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {collection.title}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {collection.slug}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{collection.game_count}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  active={collection.is_active}
                  label={collection.is_active ? 'Active' : 'Inactive'}
                />
              </td>
              <td className="px-4 py-3 text-xs text-text-muted">
                {new Date(collection.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(collection)}
                    aria-label={`Edit ${collection.title}`}
                    title="Edit"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(collection)}
                    aria-label={`Delete ${collection.title}`}
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

      <CollectionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        collection={editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete collection?"
        description={`"${deleteTarget?.title}" will be permanently removed. Games inside it are not affected.`}
        confirmLabel="Delete collection"
      />
    </div>
  )
}

export default AdminCollections
