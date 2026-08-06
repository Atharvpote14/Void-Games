import { useCallback, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Download, Trash2, X, History } from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import LazyImage from '@/components/common/LazyImage/LazyImage'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import Button from '@/components/buttons/Button/Button'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import usePageMeta from '@/hooks/usePageMeta'
import useFetch from '@/hooks/useFetch'
import {
  clearDownloadHistory,
  getDownloadHistory,
  removeDownloadRecord,
} from '@/services/users'
import { formatRelativeTime } from '@/utils/formatters'

const FALLBACK_IMAGE = '/images/placeholder.svg'

function HistoryRow({ record, onRemove }) {
  const [removing, setRemoving] = useState(false)

  const handleRemove = async () => {
    setRemoving(true)
    try {
      await onRemove(record)
    } finally {
      setRemoving(false)
    }
  }

  return (
    <div className="flex items-center gap-4 rounded-card border border-border-default bg-void-card p-4 transition-all duration-300 hover:border-border-hover">
      <Link to={`/game/${record.game_slug}`} className="shrink-0">
        <LazyImage
          src={record.game_cover || FALLBACK_IMAGE}
          alt={record.game_title}
          className="size-16 rounded-input object-cover md:size-20"
        />
      </Link>
      <div className="min-w-0 flex-1">
        <Link
          to={`/game/${record.game_slug}`}
          className="block truncate font-semibold text-text-primary transition-colors duration-200 hover:text-primary"
        >
          {record.game_title}
        </Link>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-text-muted">
          <Download className="size-3.5" />
          Downloaded {formatRelativeTime(record.downloaded_at)}
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleRemove}
        loading={removing}
        aria-label={`Remove ${record.game_title} from history`}
      >
        <X className="size-4" />
        <span className="hidden sm:inline">Remove</span>
      </Button>
    </div>
  )
}

function DownloadHistory() {
  usePageMeta({ title: 'Download History', path: '/downloads' })
  const { data: history, loading, refetch } = useFetch(() => getDownloadHistory(), [])
  const [clearing, setClearing] = useState(false)

  const handleRemove = useCallback(
    async (record) => {
      try {
        await removeDownloadRecord(record.id)
        refetch()
        toast.success('Download record removed')
      } catch {
        toast.error('Could not remove the record')
      }
    },
    [refetch]
  )

  const handleClear = async () => {
    setClearing(true)
    try {
      await clearDownloadHistory()
      refetch()
      toast.success('Download history cleared')
    } catch {
      toast.error('Could not clear download history')
    } finally {
      setClearing(false)
    }
  }

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-display text-2xl font-bold text-text-primary">
              Download History
            </h1>
            <p className="text-sm text-text-muted">
              Games you have downloaded through the site, newest first.
            </p>
          </div>
          {!loading && history?.length > 0 && (
            <Button
              variant="ghost"
              onClick={handleClear}
              loading={clearing}
              className="text-danger hover:bg-danger/10"
            >
              <Trash2 className="size-4" />
              Clear all
            </Button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-24" />
            ))}
          </div>
        ) : !history || history.length === 0 ? (
          <EmptyState
            icon={History}
            title="No downloads yet"
            description="Games you download while signed in will show up here so you can find them again."
            action={
              <Button to="/games">
                <Download className="size-4" />
                Browse Games
              </Button>
            }
          />
        ) : (
          <div className="flex flex-col gap-3">
            {history.map((record) => (
              <HistoryRow
                key={record.id}
                record={record}
                onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </Container>
    </PageWrapper>
  )
}

export default DownloadHistory
