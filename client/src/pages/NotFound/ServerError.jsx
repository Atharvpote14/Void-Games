import { ServerCrash } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import usePageMeta from '@/hooks/usePageMeta'

function ServerError() {
  usePageMeta({ title: 'Server Error', path: '/500' })

  const handleReload = () => window.location.reload()

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="grid size-20 place-items-center rounded-hero border border-danger/30 bg-danger/10">
          <ServerCrash className="size-9 text-danger" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-display text-7xl font-extrabold text-gradient">
            500
          </span>
          <h1 className="text-xl font-bold text-text-primary">
            The servers are struggling
          </h1>
          <p className="text-sm text-text-muted">
            Something went wrong on our end. Please try again in a few moments.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={handleReload}>Try Again</Button>
          <Button to="/" variant="secondary">
            Back to Home
          </Button>
        </div>
      </div>
    </section>
  )
}

export default ServerError
