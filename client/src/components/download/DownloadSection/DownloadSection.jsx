import { useState } from 'react'
import { Download, ExternalLink, KeyRound, HardDrive } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import Badge from '@/components/common/Badge/Badge'
import { Spinner } from '@/components/common/Spinner/Spinner'
import Modal from '@/components/modal/Modal/Modal'
import { getDownloadRedirectUrl, startDownload } from '@/services/downloads'
import { useAuth } from '@/hooks/useAuth'
import { addDownloadRecord } from '@/services/users'
import { formatBytes } from '@/utils/formatters'

const PROVIDER_COLORS = {
  Terabox: '#2EA8FF',
  Pixeldrain: '#7B61FF',
  GoFile: '#22C55E',
  MEGA: '#EF4444',
  'Google Drive': '#FFC857',
  MediaFire: '#F59E0B',
}

function DownloadMirrorCard({ mirror, loading, onDownload, gameSize }) {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const color = PROVIDER_COLORS[mirror.provider] || '#2EA8FF'

  const handleClick = () => {
    if (mirror.password) {
      setPasswordOpen(true)
      return
    }
    onDownload(mirror)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="group flex w-full cursor-pointer items-center justify-between gap-4 rounded-card border border-border-default bg-void-card p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:border-border-hover hover:shadow-card disabled:pointer-events-none disabled:opacity-60"
      >
        <div className="flex items-center gap-4">
          <div
            className="grid size-11 shrink-0 place-items-center rounded-xl border bg-white/5 transition-transform duration-300 group-hover:scale-110"
            style={{ borderColor: `${color}66` }}
          >
            {loading ? (
              <Spinner size="sm" style={{ color }} />
            ) : (
              <Download className="size-5" style={{ color }} />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-semibold text-text-primary">
              {mirror.mirror_name || mirror.provider}
            </span>
            <span className="flex items-center gap-2 text-xs text-text-muted">
              <Badge tone="neutral">{mirror.provider}</Badge>
              {(gameSize || mirror.file_size) && (
                <span className="inline-flex items-center gap-1">
                  <HardDrive className="size-3" />
                  {formatBytes(gameSize || mirror.file_size)}
                </span>
              )}
              {mirror.password && (
                <span className="inline-flex items-center gap-1 text-gold">
                  <KeyRound className="size-3" />
                  Password required
                </span>
              )}
            </span>
          </div>
        </div>
        <ExternalLink className="size-4.5 shrink-0 text-text-disabled transition-colors group-hover:text-primary" />
      </button>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Extraction Password"
        description={`${mirror.mirror_name || mirror.provider} requires a password`}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-input border border-border-default bg-void-bg px-4 py-3">
            <span className="text-sm text-text-muted">Password</span>
            <code className="rounded-lg bg-white/5 px-3 py-1 font-mono text-sm text-gold">
              {mirror.password}
            </code>
          </div>
          <p className="text-xs text-text-muted">
            Copy this password to extract the file after downloading. The
            password is usually case-sensitive.
          </p>
          <Button onClick={() => onDownload(mirror)} className="w-full">
            <ExternalLink className="size-4" />
            Continue to Download
          </Button>
        </div>
      </Modal>
    </>
  )
}

function DownloadSection({ gameId, game, mirrors = [] }) {
  const [downloadingId, setDownloadingId] = useState(null)
  const { user } = useAuth()

  if (mirrors.length === 0) {
    return (
      <div className="rounded-card border border-dashed border-border-default bg-void-card/50 p-8 text-center text-sm text-text-muted">
        Download mirrors are not available for this game yet.
      </div>
    )
  }

  const handleDownload = async (mirror) => {
    setDownloadingId(mirror.id)
    try {
      await startDownload(gameId, mirror.id)
      if (user && game) {
        addDownloadRecord(game).catch(() => {})
      }
      window.location.href = getDownloadRedirectUrl(mirror.id)
    } catch {
      window.open(getDownloadRedirectUrl(mirror.id), '_blank', 'noopener')
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="font-display text-xl font-bold text-text-primary">
          Download Mirrors
        </h2>
        <Badge tone="primary">
          {mirrors.length} mirror{mirrors.length > 1 ? 's' : ''}
        </Badge>
      </div>
      {mirrors.map((mirror) => (
        <DownloadMirrorCard
          key={mirror.id}
          mirror={mirror}
          loading={downloadingId === mirror.id}
          onDownload={handleDownload}
          gameSize={game?.game_size}
        />
      ))}
      <p className="text-xs text-text-muted">
        Downloads are tracked for analytics. If a mirror is broken, use the
        report button on this page and we will fix it.
      </p>
    </div>
  )
}

export default DownloadSection

