import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Clock, LogOut, MessageSquareWarning, ShieldBan } from 'lucide-react'
import Container from '@/layouts/Container/Container'
import Button from '@/components/buttons/Button/Button'
import TextArea from '@/components/inputs/TextArea/TextArea'
import TextInput from '@/components/inputs/TextInput/TextInput'
import Card from '@/components/common/Card/Card'
import { useAuth } from '@/hooks/useAuth'
import useFetch from '@/hooks/useFetch'
import { getMyUnbanRequest, submitUnbanRequest } from '@/services/unbanRequests'
import { formatDate } from '@/utils/formatters'

function SubmittedState({ request }) {
  return (
    <div className="flex flex-col items-center gap-3 py-6 text-center">
      <span className="grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
        <Clock className="size-7" />
      </span>
      <h2 className="font-display text-lg font-bold text-text-primary">
        Unban request submitted
      </h2>
      <p className="max-w-md text-sm leading-relaxed text-text-muted">
        Our team will review your request. You will be able to use the site
        again as soon as it is approved.
      </p>
      <p className="text-xs text-text-muted">
        Submitted on {formatDate(request.created_at)}
      </p>
    </div>
  )
}

function RejectedState({ request }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-card border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger">
        Your previous request was rejected. You may submit a new one below.
      </div>
      {request.admin_note && (
        <div className="rounded-card border border-border-default bg-void-bg p-4">
          <p className="text-xs font-semibold tracking-wide text-text-muted uppercase">
            Note from the team
          </p>
          <p className="mt-2 text-sm leading-relaxed text-text-secondary">
            {request.admin_note}
          </p>
        </div>
      )}
    </div>
  )
}

function Banned() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const { data: myRequest, refetch } = useFetch(getMyUnbanRequest)

  const [banReason, setBanReason] = useState('')
  const [explanation, setExplanation] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return
    if (explanation.trim().length < 10) {
      toast.error('Please explain in at least 10 characters.')
      return
    }
    setSubmitting(true)
    try {
      await submitUnbanRequest({ banReason, explanation })
      toast.success('Unban request submitted. We will review it soon.')
      setExplanation('')
      setBanReason('')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not submit the request.')
    } finally {
      setSubmitting(false)
    }
  }

  const status = myRequest?.status
  const showForm = !status || status === 'rejected'

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-void-bg px-4 py-16">
      <Container maxWidth="md" className="flex flex-col items-center gap-8">
        <Card className="w-full p-6 md:p-10">
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="grid size-16 place-items-center rounded-full bg-danger/10 text-danger">
              <ShieldBan className="size-8" />
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold text-text-primary md:text-3xl">
                Account Suspended
              </h1>
              <p className="mt-2 text-sm leading-relaxed text-text-muted">
                Hi {user?.name}, your account has been banned for violating our
                community guidelines. While your account is suspended you cannot
                comment, rate, download or interact with the site.
              </p>
            </div>
          </div>

          <div className="mt-8">
            {showForm ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {status === 'rejected' && (
                  <RejectedState request={myRequest} />
                )}
                <div className="flex flex-col gap-1.5">
                  <p className="flex items-center gap-2 text-sm font-medium text-text-secondary">
                    <MessageSquareWarning className="size-4 text-gold" />
                    Want to appeal? Tell us why you should be unbanned.
                  </p>
                  <TextInput
                    label="Why do you think you were banned? (optional)"
                    value={banReason}
                    onChange={(event) => setBanReason(event.target.value)}
                    placeholder="e.g. I think there was a misunderstanding"
                    maxLength={500}
                  />
                  <TextArea
                    label="Your explanation"
                    required
                    rows={4}
                    value={explanation}
                    onChange={(event) => setExplanation(event.target.value)}
                    placeholder="Explain what happened and why we should give you access again (at least 10 characters)..."
                    maxLength={2000}
                    hint="Our team reviews every appeal. Honest explanations are more likely to be approved."
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border-default pt-4">
                  <Button variant="ghost" onClick={handleSignOut} type="button">
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                  <Button type="submit" loading={submitting}>
                    Submit appeal
                  </Button>
                </div>
              </form>
            ) : status === 'pending' ? (
              <>
                <SubmittedState request={myRequest} />
                <div className="flex justify-center border-t border-border-default pt-4">
                  <Button variant="ghost" onClick={handleSignOut}>
                    <LogOut className="size-4" />
                    Sign out
                  </Button>
                </div>
              </>
            ) : null}
          </div>
        </Card>

        <p className="max-w-md text-center text-xs leading-relaxed text-text-muted">
          Repeated violations may result in a permanent ban. If you believe this
          is a mistake, submit an appeal and our team will look into it.
        </p>
      </Container>
    </div>
  )
}

export default Banned
