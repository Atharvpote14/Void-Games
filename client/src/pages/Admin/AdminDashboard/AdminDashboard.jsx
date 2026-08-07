import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Download,
  Eye,
  Flag,
  Folder,
  Gamepad2,
  Library,
  MessageSquare,
  Plus,
  Users,
  Wrench,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import StatCard from '@/components/admin/StatCard/StatCard'
import Button from '@/components/buttons/Button/Button'
import Card from '@/components/common/Card/Card'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { formatNumber } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { getAdminDashboard } from '@/services/admin'

const QUICK_ACTIONS = [
  { label: 'Add Game', to: '/admin/games/new', icon: Gamepad2 },
  { label: 'Add Guide', to: '/admin/guides/new', icon: Plus },
  { label: 'Add Fix', to: '/admin/fixes/new', icon: Wrench },
]

function ActionItem({ item }) {
  const Icon = item.icon
  return (
    <Link
      to={item.to}
      className="group flex cursor-pointer items-center gap-3 rounded-card border border-border-default bg-void-card px-4 py-3.5 text-sm font-medium text-text-secondary transition-all duration-300 hover:border-border-hover hover:text-text-primary"
    >
      <span className="grid size-9 place-items-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
        <Icon className="size-4" />
      </span>
      {item.label}
    </Link>
  )
}

function LatestList({ title, items, emptyLabel }) {
  return (
    <Card className="flex flex-col">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="font-display text-sm font-bold text-text-primary">{title}</h2>
      </div>
      <div className="flex flex-1 flex-col divide-y divide-border-default">
        {items.length === 0 ? (
          <EmptyState title={emptyLabel} />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-3 px-5 py-3"
            >
              <span className="min-w-0 truncate text-sm text-text-secondary">
                {item.title || item.content}
              </span>
              <span className="shrink-0 text-xs text-text-muted">
                {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}

function AdminDashboard() {
  usePageMeta({ title: 'Admin Dashboard', description: 'Void Games admin overview' })

  const { data, loading, error, refetch } = useFetch(getAdminDashboard)

  const stats = useMemo(() => {
    if (!data) return null
    return {
      games: data.total_games,
      activeGames: data.active_games,
      users: data.total_users,
      categories: data.total_categories,
      collections: data.total_collections,
      downloads: data.total_downloads,
      downloadsToday: data.downloads_today,
      downloadsMonth: data.downloads_this_month,
      views: data.total_views,
      pendingReports: data.pending_reports,
    }
  }, [data])

  if (error) {
    return (
      <div className="flex flex-col gap-6">
        <AdminPageHeader
          title="Dashboard"
          subtitle="Overview of your gaming platform."
        />
        <ErrorState title="Could not load dashboard" onRetry={refetch} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Dashboard"
        subtitle="Overview of your gaming platform."
        actions={QUICK_ACTIONS.map((item) => (
          <Button key={item.label} to={item.to} size="sm" variant="secondary">
            <Plus className="size-4" />
            {item.label}
          </Button>
        ))}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon={Gamepad2}
          label="Total Games"
          value={formatNumber(stats?.games)}
          loading={loading}
          accent="primary"
        />
        <StatCard
          icon={Users}
          label="Total Users"
          value={formatNumber(stats?.users)}
          loading={loading}
          accent="secondary"
        />
        <StatCard
          icon={Download}
          label="Downloads Today"
          value={formatNumber(stats?.downloadsToday)}
          loading={loading}
          accent="success"
        />
        <StatCard
          icon={Download}
          label="Downloads This Month"
          value={formatNumber(stats?.downloadsMonth)}
          loading={loading}
          accent="warning"
        />
        <StatCard
          icon={Download}
          label="Total Downloads"
          value={formatNumber(stats?.downloads)}
          loading={loading}
          accent="gold"
        />
        <StatCard
          icon={Eye}
          label="Total Views"
          value={formatNumber(stats?.views)}
          loading={loading}
          accent="danger"
        />
        <StatCard
          icon={Folder}
          label="Categories"
          value={formatNumber(stats?.categories)}
          loading={loading}
        />
        <StatCard
          icon={Library}
          label="Collections"
          value={formatNumber(stats?.collections)}
          loading={loading}
        />
        <StatCard
          icon={Flag}
          label="Pending Reports"
          value={formatNumber(stats?.pendingReports)}
          loading={loading}
          accent="danger"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {QUICK_ACTIONS.map((item) => (
          <ActionItem key={item.label} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <LatestList
          title="Popular Games"
          items={data?.popular_games ?? []}
          emptyLabel="No games yet"
        />
        <LatestList
          title="Latest Comments"
          items={data?.latest_comments ?? []}
          emptyLabel="No comments yet"
        />
        <LatestList
          title="Latest Games"
          items={data?.latest_games ?? []}
          emptyLabel="No games yet"
        />
        <div className="flex flex-col gap-6">
          <LatestList
            title="Latest Guides"
            items={data?.latest_guides ?? []}
            emptyLabel="No guides yet"
          />
          <LatestList
            title="Latest Fixes"
            items={data?.latest_fixes ?? []}
            emptyLabel="No fixes yet"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-text-muted">
        <MessageSquare className="size-3.5" />
        {formatNumber(stats?.activeGames)} of {formatNumber(stats?.games)} games are
        published.
      </div>
    </div>
  )
}

export default AdminDashboard
