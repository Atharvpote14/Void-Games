import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Ban, CheckCircle2, Eye, Trash2, XCircle } from 'lucide-react'
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
  deleteAdminUnbanRequest,
  getAdminUnbanRequests,
  reviewAdminUnbanRequest,
} from '@/services/admin'

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

function RequestStatusBadge({ status }) {
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

function AdminUnbanRequests() {
  usePageMeta({
    title: 'Admin Unban Requests',
    description: 'Review unban appeals',
  })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const status = searchParams.get('status') || 'all'

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminUnbanRequests({
        page,
        limit: 10,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
      }),
    [page, search, status]
  )

  const requests = data?.requests ?? []
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

  const handleApprove = async (request) => {
    if (busyId) return
    setBusyId(request.id)
    try {
      await reviewAdminUnbanRequest(request.id, { status: 'approved' })
      toast.success(`${request.name} has been unbanned`)
      setDetail((current) =>
        current?.id === request.id ? { ...current, status: 'approved' } : current
      )
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not approve the request')
    } finally {
      setBusyId(null)
    }
  }

  const handleReject = async () => {
    if (!rejectTarget) return
    setRejecting(true)
    try {
      await reviewAdminUnbanRequest(rejectTarget.id, {
        status: 'rejected',
        admin_note: rejectNote,
      })
      toast.success('Request rejected')
      setDetail((current) =>
        current?.id === rejectTarget.id
          ? { ...current, status: 'rejected', admin_note: rejectNote }
          : current
      )
      setRejectTarget(null)
      setRejectNote('')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not reject the request')
    } finally {
      setRejecting(false)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminUnbanRequest(deleteTarget.id)
      toast.success('Request deleted')
      setDeleteTarget(null)
      setDetail((current) => (current?.id === deleteTarget.id ? null : current))
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not delete the request')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Unban Requests"
        subtitle="Review appeals from banned users."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchInput
          placeholder="Search name, email or explanation..."
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
          className="w-44"
        />
      </div>

      {error ? (
        <ErrorState title="Could not load unban requests" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'email', label: 'Email' },
            { key: 'banReason', label: 'Ban Reason' },
            { key: 'explanation', label: 'Explanation' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No unban requests found."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(next) => updateParams({ page: next })}
            />
          }
        >
          {requests.map((request) => (
            <tr key={request.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar src={request.avatar} name={request.name} size="sm" />
                  <span className="min-w-0 max-w-[160px] truncate font-medium text-text-primary">
                    {request.name}
                  </span>
                </div>
              </td>
              <td className="max-w-[180px] truncate px-4 py-3 text-text-secondary">
                {request.email || '—'}
              </td>
              <td className="max-w-[160px] px-4 py-3">
                <p className="truncate text-text-secondary">
                  {request.ban_reason || '—'}
                </p>
              </td>
              <td className="max-w-[220px] px-4 py-3">
                <p className="truncate text-text-muted">{request.explanation}</p>
              </td>
              <td className="px-4 py-3">
                <RequestStatusBadge status={request.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                {formatRelativeTime(request.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDetail(request)}
                    aria-label="View request details"
                    title="View"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  {request.status === 'pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleApprove(request)}
                        disabled={busyId === request.id}
                        aria-label="Approve and unban"
                        title="Approve & unban"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-success/50 hover:text-success disabled:opacity-50"
                      >
                        <CheckCircle2 className="size-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRejectTarget(request)
                          setRejectNote('')
                        }}
                        disabled={busyId === request.id}
                        aria-label="Reject request"
                        title="Reject"
                        className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger disabled:opacity-50"
                      >
                        <XCircle className="size-3.5" />
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(request)}
                    aria-label="Delete request"
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
        title="Unban Request Details"
      >
        {detail && (
          <div className="flex flex-col gap-5">
            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                User
              </p>
              <div className="mt-2 flex items-center gap-3">
                <Avatar src={detail.avatar} name={detail.name} size="lg" />
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">
                    {detail.name}
                  </p>
                  <p className="truncate text-xs text-text-muted">
                    {detail.email || 'No email'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Status
                </p>
                <div className="mt-2.5">
                  <RequestStatusBadge status={detail.status} />
                </div>
              </div>
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Submitted
                </p>
                <p className="mt-2 text-sm text-text-secondary">
                  {formatDate(detail.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
                </p>
              </div>
            </div>

            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Why they think they were banned
              </p>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {detail.ban_reason || 'No reason given.'}
              </p>
            </div>

            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Explanation
              </p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">
                {detail.explanation}
              </p>
            </div>

            {detail.admin_note && (
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Note from the team
                </p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {detail.admin_note}
                </p>
              </div>
            )}

            {detail.status === 'pending' && (
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setDeleteTarget(detail)
                    setDetail(null)
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete
                </Button>
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    loading={busyId === detail.id}
                    onClick={() => {
                      setRejectTarget(detail)
                      setRejectNote('')
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
                    Approve & Unban
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>

      <Modal
        open={Boolean(rejectTarget)}
        onClose={() => setRejectTarget(null)}
        title="Reject unban request?"
        description={`"${rejectTarget?.name}" will stay banned.`}
        size="sm"
      >
        <form
          onSubmit={(event) => {
            event.preventDefault()
            handleReject()
          }}
          className="flex flex-col gap-4"
        >
          <TextArea
            label="Note for the user (optional)"
            value={rejectNote}
            onChange={(event) => setRejectNote(event.target.value)}
            placeholder="e.g. Spamming downloads repeatedly. You can appeal again in 30 days."
            rows={3}
            maxLength={1000}
            hint="The user will see this note on their banned page."
          />
          <div className="flex justify-end gap-3">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setRejectTarget(null)}
              disabled={rejecting}
            >
              Cancel
            </Button>
            <Button type="submit" variant="danger" loading={rejecting}>
              <Ban className="size-4" />
              Reject Request
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this request?"
        description="The appeal will be permanently removed. The user's ban status is not affected."
        confirmLabel="Delete request"
      />
    </div>
  )
}

export default AdminUnbanRequests
