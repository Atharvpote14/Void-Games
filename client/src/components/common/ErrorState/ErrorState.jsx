import { AlertTriangle } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'

function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
  compact = false,
  action,
}) {
  return (
    <div
      className={`flex flex-col items-center gap-3 rounded-card border border-error/30 bg-error/5 px-6 text-center ${compact ? 'py-8' : 'py-16'}`}
    >
      <div className="grid size-14 place-items-center rounded-xl border border-error/30 bg-error/10">
        <AlertTriangle className="size-6 text-error" />
      </div>
      <h3 className="text-headline-sm font-bold text-on-surface">{title}</h3>
      <p className="max-w-sm text-body-sm text-on-surface-muted">{description}</p>
      {action}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Try Again
        </Button>
      )}
    </div>
  )
}

export default ErrorState