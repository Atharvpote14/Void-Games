import { Spinner } from '@/components/common/Spinner/Spinner'

function PageLoader({ label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex min-h-[50vh] flex-col items-center justify-center gap-4"
    >
      <Spinner size="lg" className="text-primary" />
      <p className="text-sm font-medium text-text-muted">{label}...</p>
    </div>
  )
}

export default PageLoader
