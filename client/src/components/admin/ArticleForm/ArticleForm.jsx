import { useCallback, useEffect, useState } from 'react'
import { Link2, ListOrdered, Plus, Trash2 } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Select from '@/components/inputs/Select/Select'
import Toggle from '@/components/inputs/Toggle/Toggle'
import { slugify } from '@/utils/formatters'
import { parseArticleBlocks } from '@/utils/content'
import useFetch from '@/hooks/useFetch'
import { getAdminGamePicker } from '@/services/admin'
import { useFormPersistence } from '@/hooks/useFormPersistence'

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
  return { ...base, problem: '', symptoms: '', steps: [''], links: [] }
}

function solutionToSteps(solution) {
  const text = String(solution || '').trim()
  if (!text) return ['']

  const steps = []
  for (const block of parseArticleBlocks(text)) {
    if (block.type === 'ordered') steps.push(...block.items)
    else if (block.type === 'heading') steps.push(`## ${block.text}`)
    else if (block.type === 'list') steps.push(block.items.join(' '))
    else steps.push(block.text)
  }
  return steps.length ? steps : [text]
}

function stepsToSolution(steps) {
  const blocks = []
  let number = 1
  for (const step of steps) {
    const text = String(step || '').trim().replace(/\s*\n\s*/g, ' ')
    if (!text) continue
    blocks.push(text.startsWith('## ') ? text : `${number++}. ${text}`)
  }
  return blocks.join('\n\n')
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
    steps: solutionToSteps(article.solution),
    links: Array.isArray(article.links) ? article.links : [],
  }
}

function ArticleForm({ kind, article, open = false, onSave }) {
  const [form, setForm] = useState(() =>
    open && article ? fillFromArticle(kind, article) : buildEmptyForm(kind)
  )
  const [slugTouched, setSlugTouched] = useState(Boolean(open && article))
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formKey, setFormKey] = useState({ kind, article, open })

  const { persist, clear } = useFormPersistence({
    kind,
    article,
    open,
    initialForm: form,
    onFormChange: setForm,
  })

  useEffect(() => {
    persist(form)
  }, [form, persist])

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

  const handleLinkChange = (index, field, value) => {
    setForm((prev) => {
      const links = prev.links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
      return { ...prev, links }
    })
  }

  const addLink = () => {
    setForm((prev) => ({ ...prev, links: [...prev.links, { label: '', url: '' }] }))
  }

  const removeLink = (index) => {
    setForm((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
  }

  const handleStepChange = (index, value) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.map((step, i) => (i === index ? value : step)),
    }))
  }

  const addStep = () => {
    setForm((prev) => ({ ...prev, steps: [...prev.steps, ''] }))
  }

  const removeStep = (index) => {
    setForm((prev) => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index),
    }))
  }

  const validate = () => {
    if (!form.title.trim()) return 'Title is required'
    if (kind === 'guide') {
      if (!form.content.trim()) return 'Content is required'
      return ''
    }
    if (!form.steps.some((step) => String(step).trim())) return 'Solution is required'
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
      const { steps, ...rest } = form
      await onSave({
        ...rest,
        title: form.title.trim(),
        slug: form.slug.trim() || slugify(form.title),
        game_id: form.game_id || null,
        game_title: form.game_title.trim(),
        game_slug: form.game_slug.trim(),
        solution: kind === 'guide' ? undefined : stepsToSolution(steps),
      })
      clear()
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
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <ListOrdered className="size-4.5 text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide text-text-primary uppercase">
                Solution Steps
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Add each fix step individually. Steps are shown numbered on the fix
              page. Lines starting with `## ` are rendered as section headings.
            </p>
            <div className="flex flex-col gap-3">
              {form.steps.map((step, index) => (
                <div key={index} className="flex items-start gap-2">
                  <span className="mt-2.5 grid size-7 shrink-0 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">
                    {index + 1}
                  </span>
                  <TextArea
                    rows={2}
                    value={step}
                    onChange={(event) =>
                      handleStepChange(index, event.target.value)
                    }
                    placeholder={`Step ${index + 1}`}
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    aria-label="Remove step"
                    title="Remove step"
                    className="mt-2 grid size-11 shrink-0 cursor-pointer place-items-center rounded-input border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <Button type="button" variant="ghost" size="sm" onClick={addStep}>
                <Plus className="size-4" />
                Add Step
              </Button>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Link2 className="size-4.5 text-primary" />
              <h3 className="font-display text-sm font-bold tracking-wide text-text-primary uppercase">
                Optional Links
              </h3>
            </div>
            <p className="text-xs text-text-muted">
              Attach download links or useful resources. Users will see them as
              buttons on the fix page.
            </p>
            <div className="flex flex-col gap-3">
              {form.links.map((link, index) => (
                <div key={index} className="flex items-end gap-2">
                  <TextInput
                    label="Label"
                    value={link.label}
                    onChange={(event) =>
                      handleLinkChange(index, 'label', event.target.value)
                    }
                    placeholder="e.g. Download fix pack"
                    className="w-2/5"
                  />
                  <TextInput
                    label="URL"
                    value={link.url}
                    onChange={(event) =>
                      handleLinkChange(index, 'url', event.target.value)
                    }
                    placeholder="https://..."
                    className="flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => removeLink(index)}
                    aria-label="Remove link"
                    title="Remove link"
                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-input border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
            </div>
            <div>
              <Button type="button" variant="ghost" size="sm" onClick={addLink}>
                <Plus className="size-4" />
                Add Link
              </Button>
            </div>
          </div>
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
