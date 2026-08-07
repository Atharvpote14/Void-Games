import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { CheckCircle2, Eye, RotateCcw, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import Pagination from '@/components/search/Pagination/Pagination'
import Select from '@/components/inputs/Select/Select'
import Drawer from '@/components/modal/Drawer/Drawer'
import Avatar from '@/components/common/Avatar/Avatar'
import Button from '@/components/buttons/Button/Button'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { formatDate, formatRelativeTime } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  deleteAdminReport,
  getAdminReports,
  updateAdminReportStatus,
} from '@/services/admin'

const REASON_OPTIONS = [
  { value: 'all', label: 'All reasons' },
  'Broken download link',
  'Incorrect game information',
  'Wrong version',
  'Infected file',
  'Other',
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'solved', label: 'Solved' },
]

function ReportStatusBadge({ status }) {
  const solved = status === 'solved'
  return (
    <span
      className={
        solved
          ? 'inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success'
          : 'inline-flex items-center gap-1.5 rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning'
      }
    >
      <span
        className={solved ? 'size-1.5 rounded-full bg-success' : 'size-1.5 rounded-full bg-warning'}
      />
      {solved ? 'Solved' : 'Pending'}
    </span>
  )
}

function AdminReports() {
  usePageMeta({ title: 'Admin Reports', description: 'Review user reports' })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const status = searchParams.get('status') || 'all'
  const reason = searchParams.get('reason') || 'all'

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminReports({
        page,
        limit: 10,
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        reason: reason === 'all' ? undefined : reason,
      }),
    [page, search, status, reason]
  )

  const reports = data?.reports ?? []
  const totalPages = data?.totalPages || data?.total_pages || 1

  const [detail, setDetail] = useState(null)
  const [toggling, setToggling] = useState(false)
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

  const handleToggleStatus = async (report) => {
    setToggling(report.id)
    try {
      const next = report.status === 'solved' ? 'pending' : 'solved'
      await updateAdminReportStatus(report.id, next)
      toast.success(next === 'solved' ? 'Report marked as solved' : 'Report reopened')
      setDetail((current) => (current?.id === report.id ? { ...current, status: next } : current))
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not update report')
    } finally {
      setToggling(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminReport(deleteTarget.id)
      toast.success('Report deleted')
      setDeleteTarget(null)
      setDetail((current) => (current?.id === deleteTarget.id ? null : current))
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not delete report')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Reports"
        subtitle="Review and resolve user-submitted reports."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchInput
          placeholder="Search message or reason..."
          defaultValue={search}
          onSearch={(value) => updateParams({ q: value || undefined })}
          className="w-full sm:max-w-xs"
          inputClassName="bg-void-bg"
        />
        <div className="flex gap-3">
          <Select
            value={reason}
            onChange={(event) => updateParams({ reason: event.target.value })}
            options={REASON_OPTIONS}
            aria-label="Filter by reason"
            className="w-56"
          />
          <Select
            value={status}
            onChange={(event) => updateParams({ status: event.target.value })}
            options={STATUS_OPTIONS}
            aria-label="Filter by status"
            className="w-44"
          />
        </div>
      </div>

      {error ? (
        <ErrorState title="Could not load reports" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'game', label: 'Game' },
            { key: 'reporter', label: 'Reporter' },
            { key: 'reason', label: 'Reason' },
            { key: 'message', label: 'Message' },
            { key: 'status', label: 'Status' },
            { key: 'date', label: 'Date' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No reports found."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(next) => updateParams({ page: next })}
            />
          }
        >
          {reports.map((report) => (
            <tr key={report.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  {report.game?.cover_image ? (
                    <img
                      src={report.game.cover_image}
                      alt=""
                      className="size-9 shrink-0 rounded-xl border border-border-default object-cover"
                    />
                  ) : (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border-default bg-white/5 text-xs text-text-muted">
                      ?
                    </span>
                  )}
                  <span className="min-w-0 max-w-[180px] truncate font-medium text-text-primary">
                    {report.game?.title || 'Unknown game'}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  {report.user ? (
                    <>
                      <Avatar src={report.user.avatar} name={report.user.name} size="xs" />
                      <span className="max-w-[140px] truncate text-text-secondary">
                        {report.user.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-text-muted">Guest</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">{report.reason}</td>
              <td className="max-w-[220px] px-4 py-3">
                <p className="truncate text-text-muted">{report.message || '—'}</p>
              </td>
              <td className="px-4 py-3">
                <ReportStatusBadge status={report.status} />
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">
                {formatRelativeTime(report.created_at)}
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setDetail(report)}
                    aria-label="View report details"
                    title="View"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-border-hover hover:text-text-primary"
                  >
                    <Eye className="size-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(report)}
                    disabled={toggling === report.id}
                    aria-label={report.status === 'solved' ? 'Reopen report' : 'Mark as solved'}
                    title={report.status === 'solved' ? 'Reopen' : 'Mark solved'}
                    className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-success/50 hover:text-success disabled:opacity-50"
                  >
                    {report.status === 'solved' ? (
                      <RotateCcw className="size-3.5" />
                    ) : (
                      <CheckCircle2 className="size-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(report)}
                    aria-label="Delete report"
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
        title="Report Details"
      >
        {detail && (
          <div className="flex flex-col gap-5">
            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Game
              </p>
              <div className="mt-2 flex items-center gap-3">
                {detail.game?.cover_image ? (
                  <img
                    src={detail.game.cover_image}
                    alt=""
                    className="size-12 shrink-0 rounded-xl border border-border-default object-cover"
                  />
                ) : (
                  <span className="grid size-12 shrink-0 place-items-center rounded-xl border border-border-default bg-white/5 text-text-muted">
                    ?
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-medium text-text-primary">
                    {detail.game?.title || 'Unknown game'}
                  </p>
                  {detail.game?.slug && (
                    <p className="truncate text-xs text-text-muted">
                      /game/{detail.game.slug}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-card border border-border-default bg-void-bg p-4">
                <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                  Reported by
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
                  <ReportStatusBadge status={detail.status} />
                </div>
              </div>
            </div>

            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Reason
              </p>
              <p className="mt-2 text-sm font-medium text-text-primary">
                {detail.reason}
              </p>
            </div>

            <div className="rounded-card border border-border-default bg-void-bg p-4">
              <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
                Message
              </p>
              <p className="mt-2 text-sm leading-relaxed whitespace-pre-wrap text-text-secondary">
                {detail.message || 'No additional details provided.'}
              </p>
            </div>

            <p className="text-xs text-text-muted">
              Submitted {formatDate(detail.created_at, { dateStyle: 'medium', timeStyle: 'short' })}
            </p>

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
                variant={detail.status === 'solved' ? 'secondary' : 'success'}
                loading={toggling === detail.id}
                onClick={() => handleToggleStatus(detail)}
              >
                {detail.status === 'solved' ? (
                  <>
                    <RotateCcw className="size-4" />
                    Reopen Report
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="size-4" />
                    Mark as Solved
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this report?"
        description="The report will be permanently removed. The reported game is not affected."
        confirmLabel="Delete report"
      />
    </div>
  )
}

export default AdminReports
