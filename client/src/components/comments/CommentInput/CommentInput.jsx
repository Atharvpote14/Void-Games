import { useState } from 'react'
import { Send } from 'lucide-react'
import Avatar from '@/components/common/Avatar/Avatar'
import Button from '@/components/buttons/Button/Button'
import TextArea from '@/components/inputs/TextArea/TextArea'

function CommentInput({ onSubmit, user, className }) {
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!user) {
    return (
      <div className={`flex flex-col gap-3 rounded-card border border-dashed border-border-default bg-void-card/50 p-6 text-center ${className || ''}`}>
        <p className="text-sm text-text-muted">
          You must be logged in to join the discussion.
        </p>
        <div>
          <Button to="/login" size="sm">
            Login to Comment
          </Button>
        </div>
      </div>
    )
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const trimmed = comment.trim()
    if (!trimmed || submitting) return
    setSubmitting(true)
    try {
      await onSubmit(trimmed)
      setComment('')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex items-start gap-3.5 ${className || ''}`}
    >
      <Avatar src={user.avatar} name={user.name} size="md" />
      <div className="flex flex-1 flex-col gap-3">
        <TextArea
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Share your thoughts..."
          rows={3}
          aria-label="Write a comment"
          className="flex-1"
        />
        <div className="flex justify-end">
          <Button type="submit" size="sm" loading={submitting}>
            <Send className="size-4" />
            Post Comment
          </Button>
        </div>
      </div>
    </form>
  )
}

export default CommentInput
