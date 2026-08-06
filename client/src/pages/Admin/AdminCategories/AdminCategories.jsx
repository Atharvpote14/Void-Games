import { useCallback, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Toggle from '@/components/inputs/Toggle/Toggle'
import Drawer from '@/components/modal/Drawer/Drawer'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { slugify } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  createAdminCategory,
  deleteAdminCategory,
  getAdminCategories,
  updateAdminCategory,
} from '@/services/admin'

const EMPTY_FORM = {
  name: '',
  slug: '',
  description: '',
  icon: '',
  color: '#2EA8FF',
  sort_order: 0,
  is_active: true,
}

function CategoryForm({ open, onClose, category, onSaved }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [slugTouched, setSlugTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formKey, setFormKey] = useState({ open, category })

  if (open !== formKey.open || category !== formKey.category) {
    setFormKey({ open, category })
    if (open) {
      setError('')
      setSlugTouched(Boolean(category))
      setForm(
        category
          ? {
              name: category.name,
              slug: category.slug,
              description: category.description || '',
              icon: category.icon || '',
              color: category.color || '#2EA8FF',
              sort_order: category.sort_order ?? 0,
              is_active: category.is_active !== false,
            }
          : EMPTY_FORM
      )
    }
  }

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleNameChange = (value) => {
    setField('name', value)
    if (!slugTouched) setField('slug', slugify(value))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.name.trim()) {
      setError('Name is required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        slug: form.slug.trim() || slugify(form.name),
        sort_order: Number(form.sort_order) || 0,
      }
      if (category) {
        await updateAdminCategory(category.id, payload)
      } else {
        await createAdminCategory(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={category ? 'Edit Category' : 'Add Category'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <TextInput
          label="Name"
          required
          value={form.name}
          onChange={(event) => handleNameChange(event.target.value)}
          placeholder="e.g. Action"
        />
        <TextInput
          label="Slug"
          value={form.slug}
          onChange={(event) => {
            setSlugTouched(true)
            setField('slug', event.target.value)
          }}
          placeholder="action"
        />
        <TextArea
          label="Description"
          rows={3}
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
        />
        <TextInput
          label="Icon name"
          value={form.icon}
          onChange={(event) => setField('icon', event.target.value)}
          placeholder="Swords, Shield, Ghost..."
          hint="Must match a known icon key."
        />
        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Color"
            type="color"
            value={form.color}
            onChange={(event) => setField('color', event.target.value)}
            className="[&_input]:h-11 [&_input]:cursor-pointer [&_input]:p-1"
          />
          <TextInput
            label="Sort order"
            type="number"
            min="0"
            value={form.sort_order}
            onChange={(event) => setField('sort_order', event.target.value)}
          />
        </div>
        <Toggle
          label="Active"
          description="Inactive categories are hidden on the public site."
          checked={form.is_active}
          onChange={(event) => setField('is_active', event.target.checked)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {category ? 'Save Changes' : 'Create Category'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

function AdminCategories() {
  usePageMeta({ title: 'Admin Categories', description: 'Manage game categories' })

  const { data, loading, error, refetch } = useFetch(getAdminCategories)
  const categories =
    Array.isArray(data) ? data : (data?.categories ?? [])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (category) => {
    setEditing(category)
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
      await deleteAdminCategory(deleteTarget.id)
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
        title="Categories"
        subtitle="Organize games into browsable categories."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" />
            Add Category
          </Button>
        }
      />

      {error ? (
        <ErrorState title="Could not load categories" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'category', label: 'Category' },
            { key: 'games', label: 'Games' },
            { key: 'sort', label: 'Sort' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No categories yet. Create your first one."
        >
          {categories.map((category) => (
            <tr key={category.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <span
                    className="size-9 shrink-0 rounded-xl border border-border-default"
                    style={{ backgroundColor: category.color }}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {category.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">{category.slug}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{category.game_count}</td>
              <td className="px-4 py-3 text-text-secondary">{category.sort_order}</td>
              <td className="px-4 py-3">
                <StatusBadge
                  active={category.is_active}
                  label={category.is_active ? 'Active' : 'Inactive'}
                />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => openEdit(category)}
                    aria-label={`Edit ${category.name}`}
                    title="Edit"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Pencil className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(category)}
                    aria-label={`Delete ${category.name}`}
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

      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        category={editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete category?"
        description={
          deleteTarget?.game_count > 0
            ? `"${deleteTarget?.name}" still has ${deleteTarget?.game_count} game(s). Reassign or delete those games first.`
            : `"${deleteTarget?.name}" will be permanently removed.`
        }
        confirmLabel="Delete category"
      />
    </div>
  )
}

export default AdminCategories
