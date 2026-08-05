import Avatar from '@/components/common/Avatar/Avatar'
import Badge from '@/components/common/Badge/Badge'
import { formatRelativeTime } from '@/utils/formatters'

function CommentCard({ comment, onDelete, canDelete }) {
  return (
    <article className="flex gap-3.5 rounded-card border border-border-default bg-void-card p-4">
      <Avatar src={comment.user?.avatar} name={comment.user?.name || 'User'} size="md" />
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-text-primary">
            {comment.user?.name || 'Guest'}
          </span>
          {comment.user?.role === 'admin' && <Badge tone="secondary">Admin</Badge>}
          <span className="text-xs text-text-disabled">
            {formatRelativeTime(comment.created_at)}
          </span>
          <span className="ml-auto">
            {canDelete && (
              <button
                type="button"
                onClick={onDelete}
                className="cursor-pointer text-xs text-text-muted transition-colors hover:text-danger"
              >
                Delete
              </button>
            )}
          </span>
        </div>
        <p className="text-sm leading-relaxed text-text-secondary">{comment.comment}</p>
      </div>
    </article>
  )
}

export default CommentCard
