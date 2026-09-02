import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react'
import AdminPageHeader from '@/components/admin/AdminPageHeader/AdminPageHeader'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Select from '@/components/inputs/Select/Select'
import Toggle from '@/components/inputs/Toggle/Toggle'
import Checkbox from '@/components/inputs/Checkbox/Checkbox'
import Card from '@/components/common/Card/Card'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import PageLoader from '@/components/loading/PageLoader/PageLoader'
import { slugify } from '@/utils/formatters'
import useFetch from '@/hooks/useFetch'
import usePageMeta from '@/hooks/usePageMeta'
import { useFormPersistence } from '@/hooks/useFormPersistence'
import {
  createAdminGame,
  getAdminCategories,
  getAdminCollections,
  getAdminGame,
  updateAdminGame,
} from '@/services/admin'
import { DOWNLOAD_PROVIDERS } from '@/constants/api'

const EMPTY_LINK = {
  provider: 'Terabox',
  mirror_name: '',
  download_url: '',
  size_gb: '',
  password: '',
  is_active: true,
}

function bytesToGb(bytes) {
  return bytes ? Number((Number(bytes) / 1024 ** 3).toFixed(2)) : ''
}

function gbToBytes(gb) {
  const value = Number(gb)
  return Number.isFinite(value) && value > 0 ? Math.round(value * 1024 ** 3) : 0
}

function requirementsToJson(section) {
  const entries = Object.entries(section || {})
  return entries.length ? JSON.stringify(Object.fromEntries(entries), null, 2) : ''
}

function jsonToRequirements(json) {
  if (!json?.trim()) return {}
  try {
    const parsed = JSON.parse(json)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return null
  }
}

function initForm(game) {
  return {
    title: game?.title || '',
    slug: game?.slug || '',
    short_description: game?.short_description || '',
    description: game?.description || '',
    developer: game?.developer || '',
    publisher: game?.publisher || '',
    release_date: game?.release_date || '',
    version: game?.version || '',
    size_gb: bytesToGb(game?.size_bytes),
    video_url: game?.video_url || '',
    website_url: game?.website_url || '',
    cover_image: game?.cover_image || '',
    banner_image: game?.banner_image || '',
    logo_image: game?.logo_image || '',
    genre_id: game?.genre_id || '',
    featuresText: (game?.features || []).join(', '),
    tagsText: (game?.tags || []).join(', '),
    installation_instructions: game?.installation_instructions || '',
    minRequirementsJson: requirementsToJson(game?.system_requirements?.minimum),
    recRequirementsJson: requirementsToJson(game?.system_requirements?.recommended),
    is_featured: Boolean(game?.is_featured),
    is_trending: Boolean(game?.is_trending),
    is_active: game?.is_active !== false,
    badges:
      game?.badges?.length > 0
        ? game.badges
        : [game?.open_world_label, game?.featured_label].filter(Boolean),
    screenshots:
      game?.screenshots?.length > 0
        ? game.screenshots.map((shot) => shot.image_url || shot.url || '')
        : [''],
    download_links:
      game?.download_links?.length > 0
        ? game.download_links.map((link) => ({
            provider: link.provider || 'Terabox',
            mirror_name: link.mirror_name || '',
            download_url: link.download_url || '',
            size_gb: bytesToGb(link.file_size),
            password: link.password || '',
            is_active: link.is_active !== false,
          }))
        : [EMPTY_LINK],
    collection_ids: game?.collection_ids || [],
  }
}

function Section({ title, description, children }) {
  return (
    <Card className="flex flex-col gap-5 p-6">
      <div>
        <h2 className="font-display text-base font-bold text-text-primary">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-text-muted">{description}</p>}
      </div>
      {children}
    </Card>
  )
}

function GameFormFields({ initialGame, isEditing, gameId }) {
  const navigate = useNavigate()
  const [form, setForm] = useState(() => initForm(initialGame))
  const [slugTouched, setSlugTouched] = useState(Boolean(initialGame))
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')

  const { persist, clear } = useFormPersistence({
    kind: 'game',
    article: initialGame,
    open: true,
    initialForm: form,
    onFormChange: setForm,
  })

  useEffect(() => {
    persist(form)
  }, [form, persist])

  const { data: categoriesData } = useFetch(getAdminCategories)
  const categories = useMemo(
    () =>
      Array.isArray(categoriesData)
        ? categoriesData
        : categoriesData?.categories ?? [],
    [categoriesData]
  )

  const { data: collectionsData } = useFetch(getAdminCollections)
  const collections = useMemo(
    () =>
      Array.isArray(collectionsData)
        ? collectionsData
        : collectionsData?.collections ?? [],
    [collectionsData]
  )

  const setField = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }, [])

  const handleTitleChange = (value) => {
    setField('title', value)
    if (!slugTouched) setField('slug', slugify(value))
  }

  const updateScreenshot = (index, value) => {
    setForm((prev) => {
      const screenshots = [...prev.screenshots]
      screenshots[index] = value
      return { ...prev, screenshots }
    })
  }

  const addScreenshot = () => {
    setForm((prev) => ({ ...prev, screenshots: [...prev.screenshots, ''] }))
  }

  const removeScreenshot = (index) => {
    setForm((prev) => {
      const screenshots = prev.screenshots.filter((_, i) => i !== index)
      return { ...prev, screenshots: screenshots.length ? screenshots : [''] }
    })
  }

  const updateLink = (index, field, value) => {
    setForm((prev) => {
      const download_links = prev.download_links.map((link, i) =>
        i === index ? { ...link, [field]: value } : link
      )
      return { ...prev, download_links }
    })
  }

  const handleSizeChange = (value) => {
    setForm((prev) => {
      const download_links = prev.download_links.map((link) => ({
        ...link,
        size_gb: value,
      }))
      return { ...prev, size_gb: value, download_links }
    })
  }

  const addLink = () => {
    setForm((prev) => ({
      ...prev,
      download_links: [
        ...prev.download_links,
        { ...EMPTY_LINK, size_gb: prev.size_gb || '' },
      ],
    }))
  }

  const removeLink = (index) => {
    setForm((prev) => ({
      ...prev,
      download_links: prev.download_links.filter((_, i) => i !== index),
    }))
  }

  const toggleCollection = (collectionId) => {
    setForm((prev) => {
      const selected = prev.collection_ids.includes(collectionId)
        ? prev.collection_ids.filter((c) => c !== collectionId)
        : [...prev.collection_ids, collectionId]
      return { ...prev, collection_ids: selected }
    })
  }

  const updateBadge = (index, value) => {
    setForm((prev) => {
      const badges = [...prev.badges]
      badges[index] = value
      return { ...prev, badges }
    })
  }

  const addBadge = () => {
    setForm((prev) => ({ ...prev, badges: [...prev.badges, ''] }))
  }

  const removeBadge = (index) => {
    setForm((prev) => {
      const badges = prev.badges.filter((_, i) => i !== index)
      return { ...prev, badges: badges.length ? badges : [''] }
    })
  }

  const buildPayload = () => {
    const minimum = jsonToRequirements(form.minRequirementsJson)
    const recommended = jsonToRequirements(form.recRequirementsJson)
    if (minimum === null || recommended === null) {
      throw new Error('System requirements must be valid JSON objects')
    }

    return {
      title: form.title.trim(),
      slug: form.slug.trim() || slugify(form.title),
      short_description: form.short_description.trim(),
      description: form.description.trim(),
      developer: form.developer.trim(),
      publisher: form.publisher.trim(),
      release_date: form.release_date || null,
      version: form.version.trim(),
      size_bytes: gbToBytes(form.size_gb),
      video_url: form.video_url.trim(),
      website_url: form.website_url.trim(),
      cover_image: form.cover_image.trim(),
      banner_image: form.banner_image.trim(),
      logo_image: form.logo_image.trim(),
      genre_id: form.genre_id || null,
      features: form.featuresText
        .split(',')
        .map((feature) => feature.trim())
        .filter(Boolean),
      tags: form.tagsText
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      installation_instructions: form.installation_instructions.trim(),
      system_requirements: { minimum, recommended },
      is_featured: form.is_featured,
      is_trending: form.is_trending,
      is_active: form.is_active,
      badges: form.badges.map((badge) => badge.trim()).filter(Boolean),
      screenshots: form.screenshots.map((url) => url.trim()).filter(Boolean),
      download_links: form.download_links
        .filter((link) => link.download_url.trim())
        .map((link) => ({
          provider: link.provider,
          mirror_name: link.mirror_name.trim(),
          download_url: link.download_url.trim(),
          file_size: gbToBytes(form.size_gb || link.size_gb),
          password: link.password.trim(),
          is_active: link.is_active,
        })),
      collection_ids: form.collection_ids,
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!form.title.trim()) {
      setFormError('Game title is required')
      return
    }

    let payload
    try {
      payload = buildPayload()
    } catch (err) {
      setFormError(err.message)
      return
    }

    setSubmitting(true)
    setFormError('')
    try {
      if (isEditing) {
        await updateAdminGame(gameId, payload)
      } else {
        await createAdminGame(payload)
      }
      clear()
      navigate('/admin/games')
    } catch (err) {
      setFormError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      {formError && (
        <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
          {formError}
        </div>
      )}

      <Section title="Basic Information" description="Core details shown on the game page.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Game Name"
            required
            value={form.title}
            onChange={(event) => handleTitleChange(event.target.value)}
            placeholder="e.g. Grand Theft Auto V"
          />
          <TextInput
            label="Slug"
            value={form.slug}
            onChange={(event) => {
              setSlugTouched(true)
              setField('slug', event.target.value)
            }}
            placeholder="grand-theft-auto-v"
            hint="Used in the URL. Auto-generated from the name."
          />
          <TextInput
            label="Developer"
            value={form.developer}
            onChange={(event) => setField('developer', event.target.value)}
            placeholder="e.g. Rockstar North"
          />
          <TextInput
            label="Publisher"
            value={form.publisher}
            onChange={(event) => setField('publisher', event.target.value)}
            placeholder="e.g. Rockstar Games"
          />
          <TextInput
            label="Version"
            value={form.version}
            onChange={(event) => setField('version', event.target.value)}
            placeholder="e.g. 1.0.3095"
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextInput
              label="Release Date"
              type="date"
              value={form.release_date}
              onChange={(event) => setField('release_date', event.target.value)}
            />
            <TextInput
              label="Size (GB)"
              type="number"
              min="0"
              step="0.01"
              value={form.size_gb}
              onChange={(event) => handleSizeChange(event.target.value)}
              placeholder="e.g. 112.5"
              hint="Applies to the game and every mirror below."
            />
          </div>
          <Select
            label="Category"
            value={form.genre_id}
            onChange={(event) => setField('genre_id', event.target.value)}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            placeholder="Select a category"
          />
        </div>
        <TextArea
          label="Short Description"
          rows={2}
          maxLength={300}
          value={form.short_description}
          onChange={(event) => setField('short_description', event.target.value)}
          placeholder="One or two lines shown on cards and in search results."
        />
        <TextArea
          label="Full Description"
          rows={6}
          value={form.description}
          onChange={(event) => setField('description', event.target.value)}
          placeholder="Full game description, features, and story overview."
        />
      </Section>

      <Section title="Media" description="Images, trailer, and website links.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <TextInput
            label="Cover Image URL"
            value={form.cover_image}
            onChange={(event) => setField('cover_image', event.target.value)}
            placeholder="https://..."
          />
          <TextInput
            label="Banner Image URL"
            value={form.banner_image}
            onChange={(event) => setField('banner_image', event.target.value)}
            placeholder="https://..."
          />
          <TextInput
            label="Logo Image URL"
            value={form.logo_image}
            onChange={(event) => setField('logo_image', event.target.value)}
            placeholder="https://..."
          />
          <TextInput
            label="Trailer URL"
            value={form.video_url}
            onChange={(event) => setField('video_url', event.target.value)}
            placeholder="https://youtube.com/watch?v=..."
          />
          <TextInput
            label="Website URL"
            value={form.website_url}
            onChange={(event) => setField('website_url', event.target.value)}
            placeholder="https://..."
          />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-secondary">
              Screenshots
            </span>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={addScreenshot}
            >
              <Plus className="size-4" />
              Add screenshot
            </Button>
          </div>
          {form.screenshots.map((url, index) => (
            <div key={index} className="flex items-center gap-3">
              <TextInput
                value={url}
                onChange={(event) => updateScreenshot(index, event.target.value)}
                placeholder={`Screenshot ${index + 1} URL`}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeScreenshot(index)}
                aria-label={`Remove screenshot ${index + 1}`}
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Badges" description="Custom badges shown on the game page. Add as many as you want.">
        <div className="flex flex-col gap-3">
          {form.badges.map((badge, index) => (
            <div key={index} className="flex items-center gap-3">
              <TextInput
                value={badge}
                onChange={(event) => updateBadge(index, event.target.value)}
                placeholder={`Badge ${index + 1}, e.g. Open World`}
                className="flex-1"
              />
              <button
                type="button"
                onClick={() => removeBadge(index)}
                aria-label={`Remove badge ${index + 1}`}
                className="grid size-10 shrink-0 cursor-pointer place-items-center rounded-xl border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addBadge} className="self-start">
            <Plus className="size-4" />
            Add badge
          </Button>
        </div>
      </Section>

      <Section title="Download Mirrors" description="TeraBox, Pixeldrain, GoFile, MEGA, and more.">
        <div className="flex flex-col gap-4">
          {form.download_links.map((link, index) => (
            <div
              key={index}
              className="flex flex-col gap-3 rounded-card border border-border-default bg-void-bg-secondary p-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-text-primary">
                  Mirror {index + 1}
                </span>
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  aria-label={`Remove mirror ${index + 1}`}
                  className="grid size-9 cursor-pointer place-items-center rounded-lg border border-border-default text-text-muted transition-colors hover:border-danger/50 hover:text-danger"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                <Select
                  label="Provider"
                  value={link.provider}
                  onChange={(event) => updateLink(index, 'provider', event.target.value)}
                  options={DOWNLOAD_PROVIDERS}
                />
                <TextInput
                  label="Mirror Name"
                  value={link.mirror_name}
                  onChange={(event) => updateLink(index, 'mirror_name', event.target.value)}
                  placeholder="e.g. Mirror 1"
                />
                <TextInput
                  label="Size (GB)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.size_gb || ''}
                  onChange={(event) => handleSizeChange(event.target.value)}
                  placeholder="e.g. 52.3"
                  disabled
                  hint="Synced from game size above."
                />
              </div>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <TextInput
                  label="Download URL"
                  required
                  value={link.download_url}
                  onChange={(event) => updateLink(index, 'download_url', event.target.value)}
                  placeholder="https://terabox.com/..."
                />
                <TextInput
                  label="Password (if required)"
                  value={link.password}
                  onChange={(event) => updateLink(index, 'password', event.target.value)}
                  placeholder="e.g. voidgames"
                />
              </div>
              <Toggle
                label="Link active"
                description="Disable to hide this mirror instantly."
                checked={link.is_active}
                onChange={(event) => updateLink(index, 'is_active', event.target.checked)}
              />
            </div>
          ))}
          <Button type="button" variant="secondary" size="sm" onClick={addLink} className="self-start">
            <Plus className="size-4" />
            Add mirror
          </Button>
        </div>
      </Section>

      <Section title="Content" description="Extras, tags, requirements, and installation steps.">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextInput
            label="Features"
            value={form.featuresText}
            onChange={(event) => setField('featuresText', event.target.value)}
            placeholder="Open World, Multiplayer, 4K"
            hint="Comma-separated list."
          />
          <TextInput
            label="Tags"
            value={form.tagsText}
            onChange={(event) => setField('tagsText', event.target.value)}
            placeholder="Open World, Horror, Co-op"
            hint="Comma-separated list."
          />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <TextArea
            label="Minimum Requirements (JSON)"
            rows={8}
            value={form.minRequirementsJson}
            onChange={(event) => setField('minRequirementsJson', event.target.value)}
            placeholder={'{\n  "os": "Windows 10 64-bit",\n  "processor": "Intel Core i5-6600K"\n}'}
            inputClassName="font-mono text-xs"
          />
          <TextArea
            label="Recommended Requirements (JSON)"
            rows={8}
            value={form.recRequirementsJson}
            onChange={(event) => setField('recRequirementsJson', event.target.value)}
            placeholder={'{\n  "os": "Windows 11 64-bit",\n  "processor": "Intel Core i7-9700K"\n}'}
            inputClassName="font-mono text-xs"
          />
        </div>
        <TextArea
          label="Installation Instructions"
          rows={6}
          value={form.installation_instructions}
          onChange={(event) => setField('installation_instructions', event.target.value)}
          placeholder="Step-by-step installation guide for this build."
        />
      </Section>

      <Section title="Collections" description="Add this game to collections shown on the homepage.">
        {collections.length === 0 ? (
          <p className="text-sm text-text-muted">
            No collections yet.{' '}
            <Link
              to="/admin/collections"
              className="text-primary underline-offset-2 hover:underline"
            >
              Create one
            </Link>
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {collections.map((collection) => (
              <Checkbox
                key={collection.id}
                label={collection.title}
                checked={form.collection_ids.includes(collection.id)}
                onChange={() => toggleCollection(collection.id)}
              />
            ))}
          </div>
        )}
      </Section>

      <Section title="Publishing" description="Visibility and homepage placement.">
        <div className="flex flex-col gap-4">
          <Toggle
            label="Active"
            description="Inactive games are hidden from the public site."
            checked={form.is_active}
            onChange={(event) => setField('is_active', event.target.checked)}
          />
          <Toggle
            label="Featured"
            description="Shown in the featured section on the homepage."
            checked={form.is_featured}
            onChange={(event) => setField('is_featured', event.target.checked)}
          />
          <Toggle
            label="Trending"
            description="Shown in the trending section."
            checked={form.is_trending}
            onChange={(event) => setField('is_trending', event.target.checked)}
          />
        </div>
      </Section>

      <div className="flex items-center justify-end gap-3">
        <Button to="/admin/games" variant="ghost" disabled={submitting}>
          Cancel
        </Button>
        <Button type="submit" loading={submitting}>
          <Save className="size-4" />
          {isEditing ? 'Save Changes' : 'Create Game'}
        </Button>
      </div>
    </form>
  )
}

function GameForm() {
  const { id } = useParams()
  const isEditing = Boolean(id)

  usePageMeta({
    title: isEditing ? 'Edit Game' : 'Add Game',
    description: 'Admin game editor',
  })

  const { data: gameData, loading: gameLoading, error: gameError } = useFetch(
    () => (isEditing ? getAdminGame(id) : Promise.resolve(null)),
    [isEditing, id],
    { enabled: isEditing }
  )

  if (isEditing && gameLoading) {
    return <PageLoader label="Loading game" />
  }

  if (isEditing && gameError) {
    return <ErrorState title="Could not load game" />
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminPageHeader
        title={isEditing ? 'Edit Game' : 'Add Game'}
        subtitle={isEditing ? 'Update game details and mirrors.' : 'Create a new game entry.'}
        actions={
          <Button to="/admin/games" variant="secondary" size="sm">
            <ArrowLeft className="size-4" />
            Back to games
          </Button>
        }
      />
      <GameFormFields
        key={gameData?.id ?? 'new'}
        initialGame={gameData}
        isEditing={isEditing}
        gameId={id}
      />
    </div>
  )
}

export default GameForm
