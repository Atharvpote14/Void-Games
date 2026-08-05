import { useState } from 'react'
import toast from 'react-hot-toast'
import { AlertTriangle } from 'lucide-react'
import Modal from '@/components/modal/Modal/Modal'
import Button from '@/components/buttons/Button/Button'
import TextArea from '@/components/inputs/TextArea/TextArea'

const REPORT_REASONS = [
  'Broken download link',
  'Incorrect game information',
  'Wrong version',
  'Infected file',
  'Other',
]

function ReportModal({ open, onClose, gameId }) {
  const [reason, setReason] = useState(REPORT_REASONS[0])
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    setSubmitting(true)
    try {
      const { submitReport } = await import('@/services/reports')
      await submitReport({ gameId, reason, message })
      toast.success('Report submitted. Thank you for helping us!')
      onClose()
      setMessage('')
    } catch (err) {
      toast.error(err.message || 'Could not submit the report.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Report a Problem"
      description="Help us keep the site accurate and safe."
      size="sm"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div role="radiogroup" aria-label="Report reason" className="flex flex-col gap-2">
          {REPORT_REASONS.map((option) => (
            <label
              key={option}
              className="flex cursor-pointer items-center gap-3 rounded-input border border-border-default bg-void-bg px-4 py-3 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input
                type="radio"
                name="reason"
                value={option}
                checked={reason === option}
                onChange={() => setReason(option)}
                className="accent-[#2EA8FF]"
              />
              <span className="text-sm text-text-secondary">{option}</span>
            </label>
          ))}
        </div>
        <TextArea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Additional details (optional)"
          rows={3}
          aria-label="Additional details"
        />
        <div className="flex items-center justify-between gap-3">
          <p className="flex items-center gap-1.5 text-xs text-text-muted">
            <AlertTriangle className="size-3.5 shrink-0 text-gold" />
            We review every report.
          </p>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={onClose} type="button">
              Cancel
            </Button>
            <Button type="submit" size="sm" loading={submitting}>
              Submit Report
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}

export default ReportModal
