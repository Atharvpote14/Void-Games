import { useState } from 'react'
import { Download, ExternalLink, KeyRound, HardDrive, Copy, Check } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/common/Spinner/Spinner'
import Modal from '@/components/modal/Modal/Modal'
import { getDownloadRedirectUrl, startDownload } from '@/services/downloads'
import { useAuth } from '@/hooks/useAuth'
import { addDownloadRecord } from '@/services/users'
import { formatBytes } from '@/utils/formatters'
import { cn } from '@/utils/cn'
import toast from 'react-hot-toast'

const PROVIDER_COLORS = {
  Terabox: '#6C63FF',
  Pixeldrain: '#00E5FF',
  GoFile: '#00C896',
  MEGA: '#FF4D6D',
  'Google Drive': '#FFC857',
  MediaFire: '#FFB800',
}

function DownloadMirrorCard({ mirror, loading, onDownload, gameSize, index }) {
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const color = PROVIDER_COLORS[mirror.provider] || '#6C63FF'

  const copyPassword = () => {
    navigator.clipboard.writeText(mirror.password)
    setCopied(true)
    toast.success('Password copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

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
        className={cn(
          'group flex w-full cursor-pointer items-center justify-between gap-4 rounded-card border p-4 text-left transition-all duration-200',
          'hover:-translate-y-0.5 hover:shadow-card-hover',
          'disabled:pointer-events-none disabled:opacity-60',
          'border-border bg-surface'
        )}
        style={{
          borderLeft: `3px solid ${color}`,
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-xl border transition-transform duration-200 group-hover:scale-110',
              'bg-surface-raised'
            )}
            style={{ borderColor: `${color}40` }}
          >
            {loading ? (
              <Spinner size="sm" style={{ color }} />
            ) : (
              <Download className="size-5" style={{ color }} />
            )}
          </div>
          <div className="flex flex-col gap-1 min-w-0">
            <span className="font-semibold text-on-surface truncate">
              {mirror.mirror_name || mirror.provider}
            </span>
            <span className="flex flex-wrap items-center gap-2 text-body-xs text-on-surface-muted">
              <Badge variant="primary" className="gap-1.5" style={{ background: `${color}20`, borderColor: `${color}40` }}>
                {mirror.provider}
              </Badge>
              {(gameSize || mirror.file_size) && (
                <span className="inline-flex items-center gap-1">
                  <HardDrive className="size-3" />
                  {formatBytes(gameSize || mirror.file_size)}
                </span>
              )}
              {mirror.password && (
                <span className="inline-flex items-center gap-1 text-amber-300">
                  <KeyRound className="size-3" />
                  Password required
                </span>
              )}
              {index === 0 && (
                <Badge variant="success" className="gap-1.5">
                  Recommended
                </Badge>
              )}
            </span>
          </div>
        </div>
        <ExternalLink className="size-4.5 shrink-0 text-on-surface-muted transition-colors group-hover:text-primary" />
      </button>

      <Modal
        open={passwordOpen}
        onClose={() => setPasswordOpen(false)}
        title="Extraction Password"
        description={`${mirror.mirror_name || mirror.provider} file extracting requires a password`}
        size="sm"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between rounded-input border border-border bg-surface px-4 py-3">
            <span className="text-body-sm text-on-surface-muted">Password</span>
            <div className="flex items-center gap-3">
              <code className={cn('rounded-md px-3 py-1 font-mono text-body-sm', 'bg-primary/10 text-primary')}>
                {copied ? 'COPIED!' : 'PASS 👉'}
              </code>
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPassword}
                className="gap-1.5"
                aria-label={copied ? 'Copied' : 'Copy password'}
              >
                {copied ? (
                  <Check className="size-4 text-success" />
                ) : (
                  <Copy className="size-4" />
                )}
              </Button>
            </div>
          </div>
          <p className="text-body-xs text-on-surface-muted">
            Click to copy the password. The password is usually case-sensitive.
          </p>
          <Button onClick={() => onDownload(mirror)} className="w-full gap-2">
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
      <div className="rounded-card border border-dashed border-border bg-surface/50 p-8 text-center text-body-sm text-on-surface-muted">
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
        <h2 className="text-headline-sm font-semibold text-on-surface">Download Mirrors</h2>
        <Badge variant="primary">
          {mirrors.length} mirror{mirrors.length > 1 ? 's' : ''}
        </Badge>
      </div>
      {mirrors.map((mirror, index) => (
        <DownloadMirrorCard
          key={mirror.id}
          mirror={mirror}
          loading={downloadingId === mirror.id}
          onDownload={handleDownload}
          gameSize={game?.game_size}
          index={index}
        />
      ))}
      <p className="text-body-xs text-on-surface-muted">
        Downloads are tracked for analytics. If a mirror is broken, use the
        report button on this page and we will fix it.
      </p>
    </div>
  )
}

export default DownloadSection