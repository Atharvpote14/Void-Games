import { useState } from 'react'
import { ExternalLink, Pencil, Plus, Trash2, Video } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable, { StatusBadge } from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Toggle from '@/components/inputs/Toggle/Toggle'
import Drawer from '@/components/modal/Drawer/Drawer'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  createAdminSteamFreeStep,
  deleteAdminSteamFreeStep,
  getAdminSteamFreeContent,
  updateAdminSteamFreeStep,
  updateAdminSteamFreeVideo,
} from '@/services/admin'

const EMPTY_STEP = {
  title: '',
  description: '',
  link_label: '',
  link_url: '',
  position: 0,
  is_active: true,
}

function StepForm({ open, onClose, step, onSaved }) {
  const [form, setForm] = useState(EMPTY_STEP)
  const [formKey, setFormKey] = useState({ open, step })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  if (open !== formKey.open || step !== formKey.step) {
    setFormKey({ open, step })
    if (open) {
      setError('')
      setForm(
        step
          ? {
              title: step.title,
              description: step.description || '',
              link_label: step.link_label || '',
              link_url: step.link_url || '',
              position: step.position ?? 0,
              is_active: step.is_active !== false,
            }
          : EMPTY_STEP
      )
    }
  }

  const setField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setError('Step title is required')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      const payload = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        link_label: form.link_label.trim(),
        link_url: form.link_url.trim(),
        position: Number(form.position) || 0,
      }
      if (step) {
        await updateAdminSteamFreeStep(step.id, payload)
      } else {
        await createAdminSteamFreeStep(payload)
      }
      onSaved()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title={step ? 'Edit Step' : 'Add Step'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {error && (
          <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
            {error}
          </div>
        )}
        <TextInput
          label="Step title"
          required
          value={form.title}
          onChange={(event) => setField('title', event.target.value)}
          placeholder="e.g. Create a Steam account"
        />
        <TextArea
          label="Description"
          rows={3}
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
          placeholder="What does the user do in this step?"
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextInput
            label="Link label"
            value={form.link_label}
            onChange={(event) => setField('link_label', event.target.value)}
            placeholder="e.g. Open Steam"
          />
          <TextInput
            label="Position"
            type="number"
            min="0"
            value={form.position}
            onChange={(event) => setField('position', event.target.value)}
          />
        </div>
        <TextInput
          label="Link URL"
          value={form.link_url}
          onChange={(event) => setField('link_url', event.target.value)}
          placeholder="https://store.steampowered.com/..."
          hint="The button opens this link in a new tab. Leave empty to show the step without a link."
        />
        <Toggle
          label="Active"
          description="Inactive steps are hidden on the public page."
          checked={form.is_active}
          onChange={(event) => setField('is_active', event.target.checked)}
        />
        <div className="mt-2 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" loading={submitting}>
            {step ? 'Save Changes' : 'Add Step'}
          </Button>
        </div>
      </form>
    </Drawer>
  )
}

function AdminSteamFree() {
  usePageMeta({
    title: 'Admin Steam Free Games',
    description: 'Manage Steam free games steps and video link',
  })

  const { data, loading, error, refetch } = useFetch(getAdminSteamFreeContent)
  const steps = Array.isArray(data?.steps) ? data.steps : []

  const [videoUrl, setVideoUrl] = useState('')
  const [videoKey, setVideoKey] = useState({ loading, data })
  if (videoKey.loading !== loading || videoKey.data !== data) {
    setVideoKey({ loading, data })
    setVideoUrl(data?.video_url || '')
  }

  const [savingVideo, setSavingVideo] = useState(false)
  const [videoError, setVideoError] = useState('')
  const [videoSaved, setVideoSaved] = useState(false)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }

  const openEdit = (step) => {
    setEditing(step)
    setFormOpen(true)
  }

  const handleSaved = () => {
    setFormOpen(false)
    refetch()
  }

  const handleSaveVideo = async () => {
    setSavingVideo(true)
    setVideoError('')
    setVideoSaved(false)
    try {
      await updateAdminSteamFreeVideo(videoUrl.trim())
      setVideoSaved(true)
      refetch()
    } catch (err) {
      setVideoError(err.message)
    } finally {
      setSavingVideo(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminSteamFreeStep(deleteTarget.id)
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
        title="Steam Free Games"
        subtitle="Manage the steps, links and video shown on the Steam Free Games page."
        actions={
          <Button onClick={openCreate} size="sm">
            <Plus className="size-4" />
            Add Step
          </Button>
        }
      />

      {error ? (
        <ErrorState title="Could not load Steam Free Games content" onRetry={refetch} />
      ) : (
        <>
          <section className="flex flex-col gap-4 rounded-card border border-border-default bg-void-card p-5">
            <div className="flex items-center gap-2">
              <Video className="size-4.5 text-primary" />
              <h2 className="font-display text-sm font-bold tracking-wide text-text-primary uppercase">
                Video Guide
              </h2>
            </div>
            <div className="flex flex-col items-start gap-3">
              <TextInput
                label="Video link (YouTube or MP4)"
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or https://.../video.mp4"
                className="w-full"
              />
              <div className="flex items-center gap-3">
                <Button onClick={handleSaveVideo} loading={savingVideo} size="sm">
                  Save Video Link
                </Button>
                {videoError && (
                  <span className="text-xs text-danger">{videoError}</span>
                )}
                {videoSaved && (
                  <span className="text-xs text-success">Video link saved!</span>
                )}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <AdminTable
              columns={[
                { key: 'step', label: 'Step' },
                { key: 'link', label: 'Link' },
                { key: 'position', label: 'Position' },
                { key: 'status', label: 'Status' },
                { key: 'actions', label: 'Actions' },
              ]}
              loading={loading}
              emptyText="No steps yet. Add the first step of your guide."
            >
              {steps.map((step) => (
                <tr key={step.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium text-text-primary">
                        {step.title}
                      </p>
                      {step.description && (
                        <p className="truncate text-xs text-text-muted">
                          {step.description}
                        </p>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {step.link_url ? (
                      <a
                        href={step.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-primary transition-colors hover:text-primary/80"
                      >
                        {step.link_label || step.link_url}
                        <ExternalLink className="size-3.5" />
                      </a>
                    ) : (
                      <span className="text-xs text-text-disabled">No link</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-text-secondary">{step.position}</td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      active={step.is_active}
                      label={step.is_active ? 'Active' : 'Inactive'}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(step)}
                        aria-label={`Edit ${step.title}`}
                        title="Edit"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(step)}
                        aria-label={`Delete ${step.title}`}
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
          </section>
        </>
      )}

      <StepForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        step={editing}
        onSaved={handleSaved}
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete step?"
        description={`"${deleteTarget?.title}" will be permanently removed from the page.`}
        confirmLabel="Delete step"
      />
    </div>
  )
}

export default AdminSteamFree
