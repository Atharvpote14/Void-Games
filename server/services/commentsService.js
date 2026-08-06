import { getSupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

function toComment(row) {
  return {
    id: row.id,
    game_id: row.game_id,
    user_id: row.user_id,
    parent_id: row.parent_id,
    content: row.content,
    status: row.status,
    created_at: row.created_at,
    updated_at: row.updated_at,
    user: row.user
      ? {
          id: row.user.id,
          name: row.user.name || row.user.username || 'Anonymous',
          username: row.user.username,
          avatar: row.user.avatar,
        }
      : null,
  }
}

export async function getCommentsByGame(gameId) {
  const admin = getSupabaseAdmin()

  const { data, error } = await admin
    .from('comments')
    .select('*, user:users(id, name, username, avatar)')
    .eq('game_id', gameId)
    .eq('status', 'approved')
    .order('created_at', { ascending: false })

  if (error) throw error

  const rows = data || []
  const byId = {}
  for (const row of rows) {
    byId[row.id] = toComment(row)
  }

  const comments = []
  for (const row of rows) {
    if (row.parent_id && byId[row.parent_id]) {
      if (!byId[row.parent_id].replies) byId[row.parent_id].replies = []
      byId[row.parent_id].replies.push(byId[row.id])
    } else {
      comments.push(byId[row.id])
    }
  }

  return comments
}

export async function addComment(gameId, userId, content, parentId = null) {
  const admin = getSupabaseAdmin()

  if (!content || !content.trim()) {
    throw new ApiError(400, 'Comment cannot be empty')
  }

  const { data: game, error: gameError } = await admin
    .from('games')
    .select('id')
    .eq('id', gameId)
    .maybeSingle()

  if (gameError) throw gameError
  if (!game) throw new ApiError(404, 'Game not found')

  if (parentId) {
    const { data: parent, error: parentError } = await admin
      .from('comments')
      .select('id')
      .eq('id', parentId)
      .maybeSingle()

    if (parentError) throw parentError
    if (!parent) throw new ApiError(404, 'Parent comment not found')
  }

  const { data, error } = await admin
    .from('comments')
    .insert({
      game_id: gameId,
      user_id: userId,
      parent_id: parentId,
      content: content.trim(),
    })
    .select('*, user:users(id, name, username, avatar)')
    .single()

  if (error) throw error
  return toComment(data)
}

export async function updateComment(commentId, userId, content) {
  const admin = getSupabaseAdmin()

  if (!content || !content.trim()) {
    throw new ApiError(400, 'Comment cannot be empty')
  }

  const { data: existing, error: findError } = await admin
    .from('comments')
    .select('*')
    .eq('id', commentId)
    .maybeSingle()

  if (findError) throw findError
  if (!existing) throw new ApiError(404, 'Comment not found')
  if (existing.user_id !== userId) {
    throw new ApiError(403, 'You can only edit your own comments')
  }

  const { data, error } = await admin
    .from('comments')
    .update({ content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', commentId)
    .select('*, user:users(id, name, username, avatar)')
    .single()

  if (error) throw error
  return toComment(data)
}

export async function deleteComment(commentId, userId) {
  const admin = getSupabaseAdmin()

  const { data: existing, error: findError } = await admin
    .from('comments')
    .select('id, user_id')
    .eq('id', commentId)
    .maybeSingle()

  if (findError) throw findError
  if (!existing) throw new ApiError(404, 'Comment not found')
  if (existing.user_id !== userId) {
    throw new ApiError(403, 'You can only delete your own comments')
  }

  const { error } = await admin
    .from('comments')
    .delete()
    .eq('id', commentId)

  if (error) throw error
  return { id: commentId }
}
