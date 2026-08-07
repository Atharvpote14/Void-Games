import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ShieldBan, ShieldCheck, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import AdminTable from '@/components/admin/AdminTable/AdminTable'
import ConfirmDialog from '@/components/admin/ConfirmDialog/ConfirmDialog'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import Pagination from '@/components/search/Pagination/Pagination'
import Select from '@/components/inputs/Select/Select'
import Avatar from '@/components/common/Avatar/Avatar'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { formatDate } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import {
  deleteAdminUser,
  getAdminUsers,
  updateAdminUser,
} from '@/services/admin'

const ROLE_OPTIONS = [
  { value: 'all', label: 'All roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'banned', label: 'Banned' },
]

function UserStatusBadge({ banned }) {
  return banned ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger/10 px-2.5 py-1 text-xs font-medium text-danger">
      <span className="size-1.5 rounded-full bg-danger" />
      Banned
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
      <span className="size-1.5 rounded-full bg-success" />
      Active
    </span>
  )
}

function AdminUsers() {
  usePageMeta({ title: 'Admin Users', description: 'Manage platform users' })

  const [searchParams, setSearchParams] = useSearchParams()
  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('q') || ''
  const role = searchParams.get('role') || 'all'
  const status = searchParams.get('status') || 'all'

  const { data, loading, error, refetch } = useFetch(
    () =>
      getAdminUsers({
        page,
        limit: 10,
        search: search || undefined,
        role: role === 'all' ? undefined : role,
        status: status === 'all' ? undefined : status,
      }),
    [page, search, role, status]
  )

  const users = data?.users ?? []
  const totalPages = data?.totalPages || data?.total_pages || 1

  const [busyId, setBusyId] = useState(null)
  const [banTarget, setBanTarget] = useState(null)
  const [banning, setBanning] = useState(false)
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

  const handleRoleChange = async (user, value) => {
    if (value === user.role || busyId) return
    setBusyId(user.id)
    try {
      await updateAdminUser(user.id, { role: value })
      toast.success(`${user.name} is now ${value === 'admin' ? 'an admin' : 'a user'}`)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not update role')
    } finally {
      setBusyId(null)
    }
  }

  const handleBan = async () => {
    if (!banTarget) return
    setBanning(true)
    try {
      await updateAdminUser(banTarget.id, { is_banned: true })
      toast.success(`${banTarget.name} has been banned`)
      setBanTarget(null)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not ban user')
    } finally {
      setBanning(false)
    }
  }

  const handleUnban = async (user) => {
    if (busyId) return
    setBusyId(user.id)
    try {
      await updateAdminUser(user.id, { is_banned: false })
      toast.success(`${user.name} has been unbanned`)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not unban user')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteAdminUser(deleteTarget.id)
      toast.success(`${deleteTarget.name} has been deleted`)
      setDeleteTarget(null)
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not delete user')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title="Users"
        subtitle="Manage accounts, roles and access."
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <SearchInput
          placeholder="Search name, email, username..."
          defaultValue={search}
          onSearch={(value) => updateParams({ q: value || undefined })}
          className="w-full sm:max-w-xs"
          inputClassName="bg-void-bg"
        />
        <div className="flex gap-3">
          <Select
            value={role}
            onChange={(event) => updateParams({ role: event.target.value })}
            options={ROLE_OPTIONS}
            aria-label="Filter by role"
            className="w-40"
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
        <ErrorState title="Could not load users" onRetry={refetch} />
      ) : (
        <AdminTable
          columns={[
            { key: 'user', label: 'User' },
            { key: 'country', label: 'Country' },
            { key: 'role', label: 'Role' },
            { key: 'joined', label: 'Joined' },
            { key: 'downloads', label: 'Downloads' },
            { key: 'status', label: 'Status' },
            { key: 'actions', label: 'Actions' },
          ]}
          loading={loading}
          emptyText="No users found."
          footer={
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={(next) => updateParams({ page: next })}
            />
          }
        >
          {users.map((user) => (
            <tr key={user.id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} name={user.name} size="sm" />
                  <div className="min-w-0">
                    <p className="truncate font-medium text-text-primary">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-text-muted">
                      {user.email || user.username || 'No email'}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {user.country || '—'}
              </td>
              <td className="px-4 py-3">
                <select
                  value={user.role}
                  onChange={(event) => handleRoleChange(user, event.target.value)}
                  disabled={busyId === user.id}
                  aria-label={`Role for ${user.name}`}
                  className="h-9 cursor-pointer rounded-input border border-border-default bg-void-card px-3 text-sm text-text-primary outline-none transition-all duration-200 focus:border-primary disabled:opacity-50"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-text-secondary">
                {formatDate(user.created_at)}
              </td>
              <td className="px-4 py-3 text-text-secondary">
                {user.downloads_count}
              </td>
              <td className="px-4 py-3">
                <UserStatusBadge banned={user.is_banned} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1.5">
                  {user.is_banned ? (
                    <button
                      type="button"
                      onClick={() => handleUnban(user)}
                      disabled={busyId === user.id}
                      aria-label={`Unban ${user.name}`}
                      title="Unban"
                      className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-success/50 hover:text-success disabled:opacity-50"
                    >
                      <ShieldCheck className="size-3.5" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setBanTarget(user)}
                      disabled={busyId === user.id}
                      aria-label={`Ban ${user.name}`}
                      title="Ban"
                      className="grid size-8 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-warning/50 hover:text-warning disabled:opacity-50"
                    >
                      <ShieldBan className="size-3.5" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(user)}
                    aria-label={`Delete ${user.name}`}
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
        open={Boolean(banTarget)}
        onClose={() => setBanTarget(null)}
        onConfirm={handleBan}
        loading={banning}
        title="Ban this user?"
        description={`"${banTarget?.name}" will no longer be able to use the site. You can unban them anytime.`}
        confirmLabel="Ban user"
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="Delete this user?"
        description={`"${deleteTarget?.name}" and all their data (favorites, history, comments) will be permanently removed. This cannot be undone.`}
        confirmLabel="Delete user"
      />
    </div>
  )
}

export default AdminUsers
