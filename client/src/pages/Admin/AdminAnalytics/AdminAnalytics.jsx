import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Download,
  Eye,
  Flag,
  Gamepad2,
  MousePointerClick,
  Users,
} from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import StatCard from '@/components/admin/StatCard/StatCard'
import Card from '@/components/common/Card/Card'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import { cn } from '@/utils/cn'
import { formatCompactNumber, formatNumber } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { getAdminAnalytics } from '@/services/admin'

const DAY_OPTIONS = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
  { value: 30, label: '30 days' },
]

function BarChart({ items, accent = 'primary', label }) {
  const max = Math.max(1, ...items.map((item) => item.value))

  return (
    <div className="flex h-44 items-end gap-1.5 sm:gap-2">
      {items.map((item) => (
        <div key={item.label} className="group relative flex h-full flex-1 items-end">
          <div
            title={`${item.label}: ${formatNumber(item.value)} ${label}`}
            className={cn(
              'w-full rounded-t-md transition-all duration-300 group-hover:opacity-100',
              'min-h-[3px]',
              accent === 'secondary'
                ? 'bg-gradient-to-t from-secondary/40 to-secondary'
                : 'bg-gradient-to-t from-primary/40 to-primary'
            )}
            style={{ height: `${Math.max(2, (item.value / max) * 100)}%` }}
          />
          <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 rounded-md border border-border-default bg-void-bg px-2 py-1 text-xs font-medium whitespace-nowrap text-text-primary opacity-0 shadow-card transition-opacity duration-200 group-hover:opacity-100">
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  )
}

function ChartCard({ title, subtitle, items, accent, label }) {
  return (
    <Card className="flex flex-col gap-4 p-5">
      <div>
        <h2 className="font-display text-sm font-bold text-text-primary">{title}</h2>
        <p className="text-xs text-text-muted">{subtitle}</p>
      </div>
      {items.length === 0 ? (
        <EmptyState title="No data yet" />
      ) : (
        <BarChart items={items} accent={accent} label={label} />
      )}
      <div className="flex justify-between text-[10px] text-text-muted">
        <span>{items[0]?.label}</span>
        <span>{items[items.length - 1]?.label}</span>
      </div>
    </Card>
  )
}

function RankList({ title, items, emptyLabel, children }) {
  return (
    <Card className="flex flex-col">
      <div className="border-b border-border-default px-5 py-4">
        <h2 className="font-display text-sm font-bold text-text-primary">{title}</h2>
      </div>
      {items.length === 0 ? (
        <EmptyState title={emptyLabel} />
      ) : (
        <div className="flex flex-1 flex-col divide-y divide-border-default">
          {items.map((item, index) => (
            <div key={item.id ?? item.name} className="flex items-center gap-3 px-5 py-3">
              <span className="w-5 shrink-0 text-center font-display text-sm font-bold text-text-muted">
                {index + 1}
              </span>
              {children(item)}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

function AdminAnalytics() {
  usePageMeta({ title: 'Admin Analytics', description: 'Platform performance insights' })

  const [days, setDays] = useState(14)
  const { data, loading, error, refetch } = useFetch(() => getAdminAnalytics({ days }), [
    days,
  ])

  const totals = useMemo(() => data?.totals ?? null, [data])

  const downloadsByDay = useMemo(
    () => (data?.downloads_by_day ?? []).map((entry) => ({ label: entry.date, value: entry.downloads })),
    [data]
  )
  const newUsersByDay = useMemo(
    () => (data?.new_users_by_day ?? []).map((entry) => ({ label: entry.date, value: entry.users })),
    [data]
  )

  return (
    <div className="flex flex-col gap-8">
      <AdminPageHeader
        title="Analytics"
        subtitle="Track growth, downloads and engagement."
        actions={
          <div className="flex items-center gap-1 rounded-input border border-border-default bg-void-card p-1">
            {DAY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setDays(option.value)}
                className={cn(
                  'cursor-pointer rounded-[10px] px-3.5 py-1.5 text-xs font-medium transition-all duration-200',
                  days === option.value
                    ? 'bg-primary/15 text-primary shadow-[inset_0_0_0_1px_rgba(46,168,255,0.3)]'
                    : 'text-text-muted hover:text-text-primary'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        }
      />

      {error ? (
        <ErrorState title="Could not load analytics" onRetry={refetch} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon={Eye}
              label="Total Views"
              value={formatNumber(totals?.total_views)}
              loading={loading}
              accent="primary"
            />
            <StatCard
              icon={Download}
              label="Total Downloads"
              value={formatNumber(totals?.total_downloads)}
              loading={loading}
              accent="secondary"
            />
            <StatCard
              icon={MousePointerClick}
              label="Downloads Today"
              value={formatNumber(totals?.downloads_today)}
              loading={loading}
              accent="success"
            />
            <StatCard
              icon={Users}
              label="New Users Today"
              value={formatNumber(totals?.new_users_today)}
              loading={loading}
              accent="warning"
            />
            <StatCard
              icon={Flag}
              label="Pending Reports"
              value={formatNumber(totals?.pending_reports)}
              loading={loading}
              accent="danger"
            />
            <StatCard
              icon={Activity}
              label="Active Users"
              value={formatNumber(totals?.active_users)}
              loading={loading}
            />
            <StatCard
              icon={Users}
              label="Total Users"
              value={formatNumber(totals?.total_users)}
              loading={loading}
              accent="gold"
            />
            <StatCard
              icon={Download}
              label="Downloads This Month"
              value={formatNumber(totals?.downloads_this_month)}
              loading={loading}
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <ChartCard
              title="Downloads"
              subtitle={`Downloads per day (last ${days} days)`}
              items={downloadsByDay}
              accent="primary"
              label="downloads"
            />
            <ChartCard
              title="New Users"
              subtitle={`New user registrations per day (last ${days} days)`}
              items={newUsersByDay}
              accent="secondary"
              label="users"
            />
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RankList
              title="Popular Games"
              items={data?.popular_games ?? []}
              emptyLabel="No games yet"
            >
              {(game) => (
                <>
                  {game.cover_image ? (
                    <img
                      src={game.cover_image}
                      alt=""
                      className="size-9 shrink-0 rounded-xl border border-border-default object-cover"
                    />
                  ) : (
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-border-default bg-white/5 text-text-muted">
                      <Gamepad2 className="size-4" />
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/game/${game.slug}`}
                      className="block truncate text-sm font-medium text-text-primary transition-colors hover:text-primary"
                    >
                      {game.title}
                    </Link>
                    <p className="text-xs text-text-muted">
                      {game.categories?.name || 'Uncategorized'}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-medium text-text-primary">
                      {formatCompactNumber(game.downloads)}
                    </p>
                    <p className="text-xs text-text-muted">downloads</p>
                  </div>
                </>
              )}
            </RankList>

            <RankList
              title="Top Categories"
              items={data?.top_categories ?? []}
              emptyLabel="No categories yet"
            >
              {(category) => (
                <>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/categories/${category.slug}`}
                      className="block truncate text-sm font-medium text-text-primary transition-colors hover:text-primary"
                    >
                      {category.name}
                    </Link>
                    <p className="text-xs text-text-muted">{category.slug}</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-text-primary">
                    {category.game_count} {category.game_count === 1 ? 'game' : 'games'}
                  </p>
                </>
              )}
            </RankList>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <RankList
              title="Top Guides"
              items={data?.top_guides ?? []}
              emptyLabel="No guides yet"
            >
              {(guide) => (
                <>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/guide/${guide.slug}`}
                      className="block truncate text-sm font-medium text-text-primary transition-colors hover:text-primary"
                    >
                      {guide.title}
                    </Link>
                    <p className="text-xs text-text-muted">Guide</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-text-primary">
                    {formatCompactNumber(guide.views)} views
                  </p>
                </>
              )}
            </RankList>

            <RankList
              title="Top Fixes"
              items={data?.top_fixes ?? []}
              emptyLabel="No fixes yet"
            >
              {(fix) => (
                <>
                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/fix/${fix.slug}`}
                      className="block truncate text-sm font-medium text-text-primary transition-colors hover:text-primary"
                    >
                      {fix.title}
                    </Link>
                    <p className="text-xs text-text-muted">Fix</p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-text-primary">
                    {formatCompactNumber(fix.views)} views
                  </p>
                </>
              )}
            </RankList>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminAnalytics
