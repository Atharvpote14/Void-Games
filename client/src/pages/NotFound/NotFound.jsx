import { Link } from 'react-router-dom'
import { Ghost } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import SearchInput from '@/components/search/SearchInput/SearchInput'
import usePageMeta from '@/hooks/usePageMeta'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function NotFound() {
  usePageMeta({ title: 'Page Not Found', path: '/404' })
  const [value, setValue] = useState('')
  const navigate = useNavigate()

  const handleSearch = (query) => {
    const trimmed = (query || '').trim()
    if (trimmed) navigate(`/search?q=${encodeURIComponent(trimmed)}`)
  }

  return (
    <section className="flex min-h-[70vh] items-center justify-center px-4 py-20">
      <div className="flex w-full max-w-lg flex-col items-center gap-6 text-center">
        <div className="grid size-20 place-items-center rounded-xl border border-border bg-surface shadow-card">
          <Ghost className="size-9 text-primary" />
        </div>
        <div className="flex flex-col gap-3">
          <span className="font-display text-7xl font-extrabold bg-gradient-to-r from-primary via-primary-strong to-primary bg-clip-text text-transparent">
            404
          </span>
          <h1 className="text-headline-lg font-bold text-on-surface">
            This page drifted into the void
          </h1>
          <p className="text-body-md text-on-surface-muted max-w-md leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <SearchInput
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onSearch={handleSearch}
          className="w-full max-w-md"
        />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button to="/">Back to Home</Button>
          <Button to="/games" variant="secondary">
            Browse Games
          </Button>
        </div>
        <Link
          to="/"
          className="text-body-sm text-on-surface-muted transition-colors hover:text-primary"
        >
          Or explore popular games →
        </Link>
      </div>
    </section>
  )
}

export default NotFound
