import { useState } from 'react'
import toast from 'react-hot-toast'
import { CheckCircle2, Gamepad2, Lightbulb, Tags } from 'lucide-react'
import Container from '@/layouts/Container/Container'
import Card from '@/components/common/Card/Card'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Select from '@/components/inputs/Select/Select'
import { submitGameSuggestion } from '@/services/suggestions'
import usePageMeta from '@/hooks/usePageMeta'

const GENRE_OPTIONS = [
  'Action',
  'Adventure',
  'RPG',
  'Shooter',
  'Strategy',
  'Simulation',
  'Sports',
  'Racing',
  'Puzzle',
  'Horror',
  'Platformer',
  'Fighting',
  'Open World',
  'Indie',
  'Other',
]

function SubmittedState({ gameName, onReset }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-success/10 text-success">
        <CheckCircle2 className="size-7" />
      </span>
      <h2 className="font-display text-lg font-bold text-text-primary">
        Suggestion submitted!
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-text-muted">
        Thanks for suggesting{' '}
        <span className="font-medium text-text-primary">{gameName}</span>. Our
        team will review it and add it to the site as soon as possible.
      </p>
      <Button variant="ghost" onClick={onReset}>
        Suggest another game
      </Button>
    </div>
  )
}

function SuggestGame() {
  usePageMeta({
    title: 'Suggest a Game',
    description: 'Request a game to be added to Void Games',
  })

  const [gameName, setGameName] = useState('')
  const [genre, setGenre] = useState('')
  const [description, setDescription] = useState('')
  const [downloadLinks, setDownloadLinks] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    if (gameName.trim().length < 2) {
      toast.error('Please enter the game name.')
      return
    }
    if (description.trim().length < 10) {
      toast.error('Please tell us a little about the game (at least 10 characters).')
      return
    }
    setSubmitting(true)
    try {
      await submitGameSuggestion({
        game_name: gameName,
        genre,
        description,
        download_links: downloadLinks,
      })
      toast.success('Game suggestion submitted. We will review it soon!')
      setSubmitted(gameName.trim())
    } catch (err) {
      toast.error(err.message || 'Could not submit the suggestion.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setGameName('')
    setGenre('')
    setDescription('')
    setDownloadLinks('')
    setSubmitted(null)
  }

  return (
    <div className="py-14 md:py-18">
      <Container>
        <div className="mx-auto flex max-w-2xl flex-col gap-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Lightbulb className="size-8" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-bold text-text-primary md:text-4xl">
                Suggest a Game
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-text-muted">
                Can't find your favorite game on Void Games? Tell us about it
                and our team will try to add it to the library.
              </p>
            </div>
          </div>

          <Card className="p-6 md:p-8">
            {submitted ? (
              <SubmittedState gameName={submitted} onReset={handleReset} />
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-[1.5fr_1fr]">
                  <TextInput
                    label="Game name"
                    required
                    icon={Gamepad2}
                    value={gameName}
                    onChange={(event) => setGameName(event.target.value)}
                    placeholder="e.g. Cyberpunk 2077"
                    maxLength={120}
                  />
                  <Select
                    label="Genre (optional)"
                    value={genre}
                    onChange={(event) => setGenre(event.target.value)}
                    options={GENRE_OPTIONS}
                    placeholder="Select a genre"
                  />
                </div>

                <TextArea
                  label="About the game"
                  required
                  rows={4}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Tell us what the game is about — genre, gameplay, why it deserves a spot on Void Games (at least 10 characters)..."
                  maxLength={2000}
                  hint="More details help us find the right download sources."
                />

                <TextArea
                  label="Download links (optional)"
                  rows={3}
                  value={downloadLinks}
                  onChange={(event) => setDownloadLinks(event.target.value)}
                  placeholder="Paste any download links or sources you know of..."
                  maxLength={2000}
                />

                <div className="flex items-start gap-2.5 rounded-card border border-border-default bg-void-bg p-3.5 text-xs leading-relaxed text-text-muted">
                  <Tags className="mt-0.5 size-4 shrink-0 text-gold" />
                  <p>
                    Every suggestion is reviewed by our team before being added.
                    Please avoid requesting games that violate copyright or
                    contain malware.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-5">
                  <p className="text-xs text-text-muted">
                    Only one pending suggestion at a time.
                  </p>
                  <Button type="submit" loading={submitting}>
                    <Lightbulb className="size-4" />
                    Submit suggestion
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </div>
      </Container>
    </div>
  )
}

export default SuggestGame
