import { useState } from 'react'
import toast from 'react-hot-toast'
import { MessageSquare } from 'lucide-react'
import CommentCard from '@/components/comments/CommentCard/CommentCard'
import CommentInput from '@/components/comments/CommentInput/CommentInput'
import Skeleton from '@/components/common/Skeleton/Skeleton'
import ErrorState from '@/components/common/ErrorState/ErrorState'
import EmptyState from '@/components/common/EmptyState/EmptyState'
import useFetch from '@/hooks/useFetch'
import {
  getCommentsByGame,
  addComment,
  deleteComment,
} from '@/services/comments'

function CommentSection({ gameId, user }) {
  const { data, loading, error, refetch } = useFetch(
    () => getCommentsByGame(gameId),
    [gameId]
  )

  const [deletingId, setDeletingId] = useState(null)

  const comments = Array.isArray(data) ? data : data?.comments ?? []

  const handleAddComment = async (comment) => {
    try {
      await addComment({ gameId, comment })
      toast.success('Comment posted!')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not post the comment.')
      throw err
    }
  }

  const handleDelete = async (comment) => {
    if (!window.confirm('Delete this comment?')) return
    setDeletingId(comment.id)
    try {
      await deleteComment(comment.id)
      toast.success('Comment deleted.')
      refetch()
    } catch (err) {
      toast.error(err.message || 'Could not delete the comment.')
    } finally {
      setDeletingId(null)
    }
  }

  const renderComments = () => {
    if (loading) {
      return (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-24 rounded-card" />
          ))}
        </div>
      )
    }

    if (error) {
      return <ErrorState compact onRetry={refetch} />
    }

    if (comments.length === 0) {
      return (
        <EmptyState
          icon={MessageSquare}
          title="No comments yet"
          description="Be the first to share your thoughts about this game."
          className="py-10"
        />
      )
    }

    return (
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <CommentCard
            key={comment.id}
            comment={comment}
            canDelete={Boolean(
              user && (user.id === comment.user_id || user.role === 'admin')
            )}
            onDelete={() => handleDelete(comment)}
          />
        ))}
      </div>
    )
  }

  return (
    <section id="comments" aria-label="Comments" className="flex scroll-mt-24 flex-col gap-6">
      <h2 className="font-display text-xl font-bold text-text-primary md:text-2xl">
        Comments ({comments.length})
      </h2>
      <CommentInput user={user} onSubmit={handleAddComment} />
      {renderComments()}
      {deletingId && <span className="sr-only">Deleting comment</span>}
    </section>
  )
}

export default CommentSection
