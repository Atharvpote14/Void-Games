import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Eye, RotateCcw, Trash2, XCircle } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import Pagination from '@/components/search/Pagination/Pagination'
import Select from '@/components/inputs/Select/Select'
import Drawer from '@/components/modal/Drawer/Drawer'
import Modal from '@/components/modal/Modal/Modal'
import Avatar from '@/components/common/Avatar/Avatar'
import Button from '@/components/buttons/Button/Button'
import TextArea from '@/components/inputs/TextArea/TextArea'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { cn } from '@/utils/cn'
import { formatDate, formatRelativeTime } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  deleteAdminSuggestion,
  getAdminSuggestions,
  updateAdminSuggestion,
} from '@/services/admin'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function SuggestionStatusBadge({ status }) {
  const styles = {
    pending: 'bg-warning/10 text-warning',
    approved: 'bg-success/10 text-success',
    rejected: 'bg-danger/10 text-danger',
  }
  const dots = {
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
  }
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
        styles[status]
      )}
    >
      <span className={cn('size-1.5 rounded-full', dots[status])} />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function AdminSuggestions() {
  usePageMeta({
    title: 'Admin Game Suggestions',
    description: 'Review user game suggestions',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const status = searchParams.get('status') || 'all'

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminSuggestions({
        page,
        limit: 10,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
      }),
    [page, search, status]
  )

  const suggestions = data?.suggestions ?? []
  const totalPages = data?.totalPages || data?.total_pages || 1

  const [detail, setDetail] = useState(null)
  const [busyId, setBusyId] = useState(null)
  const [rejectTarget, setRejectTarget] = useState(null)
  const [rejectNote, setRejectNote] = useState('')
  const [rejecting, setRejecting] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '' || value === 'all') {
        next.delete(key)
      } else {
        next.set(key, value)
      }
    })
    next.delete('page')
    setSearchParams(next)
  }

  const applyStatus = async (suggestion, nextStatus, note) => {
    if (busyId) return
    setBusyId(suggestion.id)
    try {
      await updateAdminSuggestion(suggestion.id, {
        status: nextStatus,
        admin_note: note,
      })
      toast.success(
        nextStatus === 'approved'
          ? 'Suggestion approved'
          : nextStatus === 'rejected'
            ? 'Suggestion rejected'
            : 'Suggestion reopened'
      )
      setDetail((current) =>
        current?.id === suggestion.id
          ? { ...current, status: nextStatus, admin_note: note || '' }
          : current
      )
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not update the suggestion')
    } finally {
      setBusyId(null)
    }
  }

  const handleApprove = (suggestion) => applyStatus(suggestion, 'approved', '')

  const handleReject = async () => {
    if (!rejectTarget) return
    setRejecting(true)
    try {
      await applyStatus(rejectTarget, 'rejected', rejectNote)
      setRejectTarget(null)
      setRejectNote('')
    } catch {
      // error already surfaced by applyStatus
    } finally {
      setRejecting(false)
    }
  }

  const handleReopen = (suggestion) => applyStatus(suggestion, 'pending', '')

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminSuggestion(deleteTarget.id)
      toast.success('Suggestion deleted')
      setDeleteTarget(null)
      setDetail((current) => (current?.id === deleteTarget.id ? null : current))
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not delete suggestion')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Game Suggestions"
        subtitle="Review games requested by users."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchInput
          placeholder="Search game or genre..."
          defaultValue={search}
          onSearch={(value) => updateParams({ q: value || undefined })}
          className="w-full sm:max-w-xs"
          inputClassName="bg-void-bg"
        />
        <Select
          value={status}
          onChange={(event) => updateParams({ status: event.target.value })}
          options={STATUS_OPTIONS}
          aria-label="Filter by status"
          className="w-full min-w-0 flex-1 sm:w-44 sm:flex-none"
        />
      </div>

      {error ? (
        <ErrorState title="Could not load suggestions" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'game', label: 'Game' },
            { key: 'suggester', label: 'Suggested by' },
            { key: 'genre', label: 'Genre' },
            { key: 'description', label: 'Description' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No game suggestions found."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(next) => updateParams({ page: next })}
            />
          }
        >
          {suggestions.map((suggestion) => (
            <tr key={suggestion.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <span className="font-medium text-text-primary">
                  {suggestion.game_name}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {suggestion.user ? (
                    <>
                      <Avatar src={suggestion.user.avatar} name={suggestion.user.name} size="xs" />
                      <span className="max-w-[140px] truncate text-text-secondary">
                        {suggestion.user.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-text-muted">Guest</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {suggestion.genre || '—'}
              </td>
              <td className="max-w-[240px] px-4 py-3">
                <p className="truncate text-text-muted">{suggestion.description}</p>
              </td>
              <td className="px-4 py-3">
                <SuggestionStatusBadge status={suggestion.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                {formatRelativeTime(suggestion.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDetail(suggestion)}
                    aria-label="View suggestion details"
                    title="View"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  {suggestion.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(suggestion)}
                        disabled={busyId === suggestion.id}
                        aria-label="Approve suggestion"
                        title="Approve"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-success/50 hover:text-success disabled:opacity-50"
                      >
                        <CheckCircle2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectTarget(suggestion)
                          setRejectNote(suggestion.admin_note || '')
                        }}
                        disabled={busyId === suggestion.id}
                        aria-label="Reject suggestion"
                        title="Reject"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger disabled:opacity-50"
                      >
                        <XCircle className="size-3.5" />
                      </button>
                    </>
                  )}
                  {suggestion.status !== 'pending' && (
                    <button
                      type="button"
                      onClick={() => handleReopen(suggestion)}
                      disabled={busyId === suggestion.id}
                      aria-label="Reopen suggestion"
                      title="Reopen"
                      className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-warning/50 hover:text-warning disabled:opacity-50"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(suggestion)}
                    aria-label="Delete suggestion"
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
        open={Boolean(detail)}
        onClose={() => setDetail(null)}
        title="Suggestion Details"
      >
        {detail && (
          <div className="flex flex-col gap-5">
            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Game
              </p>
              <p className="mt-1.5 font-display text-lg font-bold text-text-primary">
                {detail.game_name}
              </p>
              {detail.genre && (
                <p className="mt-1 text-xs text-text-muted">{detail.genre}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 min-[400px]:grid-cols-2">
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Suggested by
                </p>
                <div className="mt-2 flex items-center gap-2.5">
                  {detail.user ? (
                    <>
                      <Avatar src={detail.user.avatar} name={detail.user.name} size="sm" />
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-text-primary">
                          {detail.user.name}
                        </span>
                        <span className="block truncate text-xs text-text-muted">
                          {detail.user.email}
                        </span>
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-text-secondary">Guest</span>
                  )}
                </div>
              </div>
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Status
                </p>
                <div className="mt-2.5">
                  <SuggestionStatusBadge status={detail.status} />
                </div>
              </div>
            </div>

            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Description
              </p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">
                {detail.description || 'No description provided.'}
              </p>
            </div>

            {detail.download_links && (
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Download links
                </p>
                <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap break-all text-text-secondary">
                  {detail.download_links}
                </p>
              </div>
            )}

            <p className="text-xs text-text-muted">
              Submitted{' '}
              {formatDate(detail.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
              {detail.reviewed_at &&
                ` · Reviewed ${formatDate(detail.reviewed_at, {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}`}
            </p>

            {detail.status === 'pending' && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    setRejectTarget(detail)
                    setRejectNote('')
                    setDetail(null)
                  }}
                >
                  <XCircle className="size-4" />
                  Reject
                </Button>
                <Button
                  variant="success"
                  loading={busyId === detail.id}
                  onClick={() => handleApprove(detail)}
                >
                  <CheckCircle2 className="size-4" />
                  Approve Suggestion
                </Button>
              </div>
            )}

            {detail.status !== 'pending' && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                <Button
                  variant="danger"
                  onClick={() => {
                    setDeleteTarget(detail)
                    setDetail(null)
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  loading={busyId === detail.id}
                  onClick={() => handleReopen(detail)}
                >
                  <RotateCcw className="size-4" />
                  Reopen Suggestion
                </Button>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Reject Suggestion"
      >
        {rejectTarget && (
          <div className="flex flex-col gap-4">
            <p className="text-sm leading-relaxed text-text-muted">
              Rejecting{' '}
              <span className="font-medium text-text-primary">
                {rejectTarget.game_name}
              </span>
              . Add a note so the user knows why (optional).
            </p>
            <TextArea
              label="Note to the user"
              rows={3}
              value={rejectNote}
              onChange={(event) => setRejectNote(event.target.value)}
              placeholder="e.g. This game is already on the site."
              maxLength={1000}
            />
            <div className="flex justify-end gap-3 border-t border-border-default pt-4">
              <Button variant="ghost" onClick={() => setRejectTarget(null)}>
                Cancel
              </Button>
              <Button variant="danger" loading={rejecting} onClick={handleReject}>
                <XCircle className="size-4" />
                Reject suggestion
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this suggestion?"
        description="The suggestion will be permanently removed."
        confirmLabel="Delete suggestion"
      />
    </div>
  )
}

export default AdminSuggestions
