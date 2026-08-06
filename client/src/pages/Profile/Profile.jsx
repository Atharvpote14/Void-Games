import { Link } from 'react-router-dom'
import {
  CalendarDays,
  Globe,
  Heart,
  History,
  MapPin,
  UserRound,
  Mail,
} from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Avatar from '@/components/common/Avatar/Avatar'
import Badge from '@/components/common/Badge/Badge'
import Button from '@/components/buttons/Button/Button'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import { useAuth } from '@/hooks/useAuth'
import { useFavorites } from '@/hooks/useFavorites'
import { getDownloadHistory } from '@/services/users'
import { formatDate } from '@/utils/formatters'

function StatCard({ icon: Icon, label, value, to }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-card border border-border-default bg-void-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover"
    >
      <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-border-default bg-white/5">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </Link>
  )
}

function Profile() {
  usePageMeta({ title: 'Profile', path: '/profile' })
  const { user } = useAuth()
  const { favorites, loading: favoritesLoading } = useFavorites()
  const { data: history, loading: historyLoading } = useFetch(
    () => getDownloadHistory(),
    []
  )

  if (!user) return null

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-12">
        <section className="overflow-hidden rounded-card border border-border-default bg-void-card">
          <div className="h-32 bg-btn-gradient/20 md:h-40" />
          <div className="relative -mt-12 flex flex-col gap-6 px-6 pb-8 md:-mt-14 md:flex-row md:items-end md:justify-between md:px-10">
            <div className="flex flex-col items-start gap-4 md:flex-row md:items-end">
              <Avatar
                src={user.avatar}
                name={user.name}
                size="xl"
                className="size-24 border-4 border-void-card md:size-28"
              />
              <div>
                <div className="flex items-center gap-2.5">
                  <h1 className="font-display text-2xl font-bold text-text-primary">
                    {user.name}
                  </h1>
                  {user.role === 'admin' && <Badge tone="secondary">Admin</Badge>}
                </div>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                  {user.username && (
                    <span className="inline-flex items-center gap-1.5">
                      <UserRound className="size-3.5" />
                      @{user.username}
                    </span>
                  )}
                  {user.email && (
                    <span className="inline-flex items-center gap-1.5">
                      <Mail className="size-3.5" />
                      {user.email}
                    </span>
                  )}
                  {user.country && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {user.country}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays className="size-3.5" />
                    Joined {formatDate(user.created_at)}
                  </span>
                </div>
              </div>
            </div>
            <Button to="/settings" variant="secondary">
              Edit profile
            </Button>
          </div>
          {user.bio && (
            <div className="border-t border-border-default px-6 py-5 md:px-10">
              <p className="flex items-start gap-2.5 text-sm leading-relaxed text-text-secondary">
                <Globe className="mt-0.5 size-4 shrink-0 text-text-muted" />
                {user.bio}
              </p>
            </div>
          )}
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <StatCard
            icon={Heart}
            label="Favorites"
            value={favoritesLoading ? '—' : favorites.length}
            to="/favorites"
          />
          <StatCard
            icon={History}
            label="Games downloaded"
            value={historyLoading || !history ? '—' : history.length}
            to="/downloads"
          />
        </section>

        <section className="flex flex-col gap-4 md:flex-row">
          <Button
            variant="secondary"
            to="/favorites"
            className="md:flex-1"
          >
            <Heart className="size-4" />
            View Favorites
          </Button>
          <Button to="/downloads" className="md:flex-1">
            <History className="size-4" />
            View Download History
          </Button>
        </section>
      </Container>
    </PageWrapper>
  )
}

export default Profile

