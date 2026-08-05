import { Wrench } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import usePageMeta from '@/hooks/usePageMeta'

function Maintenance() {
  usePageMeta({ title: 'Maintenance', path: '/maintenance' })

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="flex w-full max-w-md flex-col items-center gap-5 text-center">
        <div className="grid size-20 place-items-center rounded-hero border border-border-default bg-void-card shadow-card">
          <Wrench className="size-9 text-gold" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Under Maintenance
          </h1>
          <p className="text-sm text-text-muted">
            We are running scheduled maintenance to improve your experience.
            We will be back shortly.
          </p>
        </div>
        <Button to="/">Back to Home</Button>
      </div>
    </section>
  )
}

export default Maintenance
