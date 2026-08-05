import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import Button from '@/components/buttons/Button/Button'
import TextInput from '@/components/inputs/TextInput/TextInput'

function Newsletter({ className }) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (!email.trim()) return

    setLoading(true)
    try {
      const { subscribe } = await import('@/services/newsletter')
      await subscribe(email.trim())
      toast.success('Subscribed! Welcome to the Void.')
      setEmail('')
    } catch (error) {
      toast.error(error.message || 'Could not subscribe. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col gap-3 sm:flex-row ${className || ''}`}
    >
      <TextInput
        type="email"
        required
        placeholder="Enter your email"
        aria-label="Email address"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        className="flex-1"
        inputClassName="bg-void-bg-secondary"
      />
      <Button type="submit" loading={loading} className="shrink-0">
        <Send className="size-4" />
        Subscribe
      </Button>
    </form>
  )
}

export default Newsletter
