import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Bell, LogOut, Save, ShieldCheck, UserRound } from 'lucide-react'
import PageWrapper from '@/layouts/PageWrapper/PageWrapper'
import Container from '@/layouts/Container/Container'
import Avatar from '@/components/common/Avatar/Avatar'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'
import TextArea from '@/components/inputs/TextArea/TextArea'
import Toggle from '@/components/inputs/Toggle/Toggle'
import usePageMeta from '@/hooks/usePageMeta'
import useAuth from '@/hooks/useAuth'
import { updateProfile } from '@/services/users'

const PREFERENCES_KEY = 'vg_preferences'

const DEFAULT_PREFERENCES = {
  emailNotifications: true,
  downloadReminders: true,
  weeklyDigest: false,
}

function loadPreferences() {
  try {
    return { ...DEFAULT_PREFERENCES, ...JSON.parse(localStorage.getItem(PREFERENCES_KEY)) }
  } catch {
    return { ...DEFAULT_PREFERENCES }
  }
}

function ProfileForm({ user, onSaved }) {
  const [form, setForm] = useState({
    name: user.name || '',
    username: user.username || '',
    bio: user.bio || '',
    country: user.country || '',
    avatar: user.avatar || '',
  })
  const [saving, setSaving] = useState(false)

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }))
  }

  const handleSave = async (event) => {
    event.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      await onSaved()
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form
      onSubmit={handleSave}
      className="flex flex-col gap-6 rounded-card border border-border-default bg-void-card p-6 md:p-8"
    >
      <div className="flex items-center gap-5">
        <Avatar src={user.avatar} name={user.name} size="xl" />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-text-primary">{user.name}</p>
          <p className="text-sm text-text-muted">
            Your avatar comes from your Google account.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <TextInput
          label="Display name"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="Your name"
          icon={UserRound}
          required
        />
        <TextInput
          label="Username"
          value={form.username}
          onChange={handleChange('username')}
          placeholder="username"
          leftAddon="@"
        />
        <TextInput
          label="Country"
          value={form.country}
          onChange={handleChange('country')}
          placeholder="e.g. United States"
          className="md:col-span-2"
        />
      </div>

      <TextArea
        label="Bio"
        value={form.bio}
        onChange={handleChange('bio')}
        placeholder="Tell the community about yourself (300 characters max)"
        rows={3}
        maxLength={300}
      />

      <div className="flex justify-end">
        <Button type="submit" loading={saving}>
          <Save className="size-4" />
          Save changes
        </Button>
      </div>
    </form>
  )
}

function Preferences() {
  const [preferences, setPreferences] = useState(loadPreferences)

  const handleToggle = (key) => (event) => {
    const next = { ...preferences, [key]: event.target.checked }
    setPreferences(next)
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next))
  }

  return (
    <section className="flex flex-col gap-4 rounded-card border border-border-default bg-void-card p-6 md:p-8">
      <h2 className="flex items-center gap-2 font-display text-lg font-bold text-text-primary">
        <Bell className="size-4.5 text-primary" />
        Preferences
      </h2>
      <div className="flex flex-col gap-5">
        <Toggle
          label="Email notifications"
          description="Product updates and account alerts"
          checked={preferences.emailNotifications}
          onChange={handleToggle('emailNotifications')}
        />
        <Toggle
          label="Download reminders"
          description="Remind me about pending or interrupted downloads"
          checked={preferences.downloadReminders}
          onChange={handleToggle('downloadReminders')}
        />
        <Toggle
          label="Weekly digest"
          description="A weekly roundup of new games and guides"
          checked={preferences.weeklyDigest}
          onChange={handleToggle('weeklyDigest')}
        />
      </div>
    </section>
  )
}

function Settings() {
  usePageMeta({ title: 'Settings', path: '/settings' })
  const { user, refreshProfile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
    toast.success('Signed out')
  }

  if (!user) return null

  return (
    <PageWrapper>
      <Container className="flex flex-col gap-8 py-12">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-display text-2xl font-bold text-text-primary">
            Settings
          </h1>
          <p className="text-sm text-text-muted">
            Manage your profile information and account preferences.
          </p>
        </div>

        <ProfileForm key={user.id} user={user} onSaved={refreshProfile} />
        <Preferences />

        <section className="flex flex-col gap-4 rounded-card border border-danger/30 bg-danger/5 p-6 md:p-8">
          <h2 className="flex items-center gap-2 font-display text-lg font-bold text-text-primary">
            <ShieldCheck className="size-4.5 text-danger" />
            Account
          </h2>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-text-muted">
              Signing out only ends your session on this device. Your favorites
              and history stay saved to your account.
            </p>
            <Button variant="ghost" onClick={handleSignOut} className="text-danger hover:bg-danger/10">
              <LogOut className="size-4" />
              Sign out
            </Button>
          </div>
        </section>
      </Container>
    </PageWrapper>
  )
}

export default Settings
