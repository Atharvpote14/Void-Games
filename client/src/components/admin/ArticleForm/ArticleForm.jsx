import { useCallback, useState } from 'react'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Select from '@/components/inputs/Select/Select'
import Toggle from '@/components/inputs/Toggle/Toggle'
import { slugify } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import { getAdminGamePicker } from '@/services/admin'

const ARTICLE_FIELDS = {
  guide: {
    title: 'Guide',
    singular: 'guide',
    requiredLabel: 'Content',
  },
  fix: {
    title: 'Fix',
    singular: 'fix',
    requiredLabel: 'Solution',
  },
}

function buildEmptyForm(kind) {
  const base = {
    title: '',
    slug: '',
    thumbnail: '',
    category: '',
    game_id: '',
    game_title: '',
    game_slug: '',
    is_featured: false,
  }
  if (kind === 'guide') {
    return { ...base, author: 'Void Games Team', content: '' }
  }
  return { ...base, problem: '', symptoms: '', solution: '' }
}

function fillFromArticle(kind, article) {
  const base = {
    title: article.title || '',
    slug: article.slug || '',
    thumbnail: article.thumbnail || '',
    category: article.category || '',
    game_id: article.game_id || '',
    game_title: article.game_title || '',
    game_slug: article.game_slug || '',
    is_featured: Boolean(article.is_featured),
  }
  if (kind === 'guide') {
    return {
      ...base,
      author: article.author || 'Void Games Team',
      content: article.content || '',
    }
  }
  return {
    ...base,
    problem: article.problem || '',
    symptoms: article.symptoms || '',
    solution: article.solution || '',
  }
}

function ArticleForm({ kind, article, open = false, onSave }) {
  const [form, setForm] = useState(() => buildEmptyForm(kind))
  const [slugTouched, setSlugTouched] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formKey, setFormKey] = useState({ kind, article, open })

  if (
    open !== formKey.open ||
    kind !== formKey.kind ||
    article !== formKey.article
  ) {
    setFormKey({ kind, article, open })
    if (open) {
      setError('')
      setSlugTouched(Boolean(article))
      setForm(article ? fillFromArticle(kind, article) : buildEmptyForm(kind))
    }
  }

  const { data: pickerData } = useFetch(getAdminGamePicker)
  const games = Array.isArray(pickerData) ? pickerData : (pickerData?.games ?? [])

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleTitleChange = (value) => {
    setField('title', value)
    if (!slugTouched) setField('slug', slugify(value))
  }

  const handleGameChange = (gameId) => {
    const game = games.find((item) => item.id === gameId)
    setField('game_id', gameId)
    setField('game_title', game?.title || '')
    setField('game_slug', game?.slug || '')
  }

  const validate = () => {
    if (!form.title.trim()) return 'Title is required'
    const required = kind === 'guide' ? form.content : form.solution
    if (!required.trim()) return `${ARTICLE_FIELDS[kind].requiredLabel} is required`
    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setSubmitting(true)
    setError('')
    try {
      await onSave({
        ...form,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        game_id: form.game_id || null,
        game_title: form.game_title.trim(),
        game_slug: form.game_slug.trim(),
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {error && (
        <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TextInput
          label="Title"
          required
          value={form.title}
          onChange={(event) => handleTitleChange(event.target.value)}
          placeholder={
            kind === 'guide'
              ? 'e.g. How to Install Mods Safely'
              : 'e.g. Fix Game Crashing on Launch'
          }
        />
        <TextInput
          label="Slug"
          value={form.slug}
          onChange={(event) => {
            setSlugTouched(true)
            setField('slug', event.target.value)
          }}
          placeholder="auto-generated"
        />
        <TextInput
          label="Thumbnail URL"
          value={form.thumbnail}
          onChange={(event) => setField('thumbnail', event.target.value)}
          placeholder="https://..."
        />
        <TextInput
          label="Category"
          value={form.category}
          onChange={(event) => setField('category', event.target.value)}
          placeholder="e.g. Installation"
        />
        <TextInput
          label="Related Game"
          value={form.game_title}
          onChange={(event) => {
            setField('game_title', event.target.value)
            setField('game_id', '')
          }}
          placeholder="Search or type a game title"
        />
        <SelectGame games={games} value={form.game_id} onChange={handleGameChange} />
        {kind === 'guide' && (
          <TextInput
            label="Author"
            value={form.author}
            onChange={(event) => setField('author', event.target.value)}
          />
        )}
      </div>

      {kind === 'guide' ? (
        <>
          <Toggle
            label="Featured guide"
            description="Featured guides appear prominently on the Guides page."
            checked={form.is_featured}
            onChange={(event) => setField('is_featured', event.target.checked)}
          />
          <TextArea
            label="Content"
            required
            rows={14}
            value={form.content}
            onChange={(event) => setField('content', event.target.value)}
            placeholder={
              'Write the guide here.\n\nUse blank lines between paragraphs. Supports:\n## Section headings\n- bullet points\n1. numbered steps'
            }
          />
        </>
      ) : (
        <>
          <TextArea
            label="Problem"
            rows={3}
            value={form.problem}
            onChange={(event) => setField('problem', event.target.value)}
            placeholder="What is the issue?"
          />
          <TextArea
            label="Symptoms"
            rows={4}
            value={form.symptoms}
            onChange={(event) => setField('symptoms', event.target.value)}
            placeholder="What does the user see or experience?"
          />
          <TextArea
            label="Solution"
            required
            rows={10}
            value={form.solution}
            onChange={(event) => setField('solution', event.target.value)}
            placeholder={
              'Step-by-step fix.\n\n1. First step\n2. Second step\n\nUse blank lines between sections.'
            }
          />
        </>
      )}

      <div className="flex items-center justify-end">
        <Button type="submit" loading={submitting}>
          {article ? 'Save Changes' : `Create ${ARTICLE_FIELDS[kind].title}`}
        </Button>
      </div>
    </form>
  )
}

function SelectGame({ games, value, onChange }) {
  return (
    <Select
      label="Select from library"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      options={games.map((game) => ({ label: game.title, value: game.id }))}
      placeholder="Choose a game"
    />
  )
}

export default ArticleForm
