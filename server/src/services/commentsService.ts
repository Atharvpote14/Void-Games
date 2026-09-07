import type { SupabaseAdmin } from '../config/supabase.js'
import { ApiError } from '../utils/ApiError.js'

function toComment(row: any) {
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

export async function getCommentsByGame(supabase: SupabaseAdmin, gameId: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, user:users(id, name, username, avatar)')
      .eq('game_id', gameId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (error) {
      console.warn('getCommentsByGame error:', { gameId, error: error.message })
      return []
    }

    const rows = data || []
    const byId: Record<string, any> = {}
    for (const row of rows) {
      byId[row.id] = toComment(row)
    }

    const comments: any[] = []
    for (const row of rows) {
      if (row.parent_id && byId[row.parent_id]) {
        if (!byId[row.parent_id].replies) byId[row.parent_id].replies = []
        byId[row.parent_id].replies.push(byId[row.id])
      } else {
        comments.push(byId[row.id])
      }
    }

    return comments
  } catch (err) {
    console.error('getCommentsByGame error:', { gameId, error: err instanceof Error ? err.message : String(err) })
    return []
  }
}

export async function addComment(supabase: SupabaseAdmin, gameId: string, userId: string, content: string, parentId: string | null = null) {
  try {
    if (!content || !content.trim()) {
      throw new ApiError(400, 'Comment cannot be empty')
    }

    const { data: game, error: gameError } = await supabase
      .from('games')
      .select('id')
      .eq('id', gameId)
      .maybeSingle()

    if (gameError) throw gameError
    if (!game) throw new ApiError(404, 'Game not found')

    if (parentId) {
      const { data: parent, error: parentError } = await supabase
        .from('comments')
        .select('id')
        .eq('id', parentId)
        .maybeSingle()

      if (parentError) throw parentError
      if (!parent) throw new ApiError(404, 'Parent comment not found')
    }

    const { data, error } = await supabase
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
  } catch (err) {
    console.error('addComment error:', { gameId, userId, error: err instanceof Error ? err.message : String(err) })
    throw err
  }
}

export async function updateComment(supabase: SupabaseAdmin, commentId: string, userId: string, content: string) {
  try {
    if (!content || !content.trim()) {
      throw new ApiError(400, 'Comment cannot be empty')
    }

    const { data: existing, error: findError } = await supabase
      .from('comments')
      .select('*')
      .eq('id', commentId)
      .maybeSingle()

    if (findError) throw findError
    if (!existing) throw new ApiError(404, 'Comment not found')
    if (existing.user_id !== userId) {
      throw new ApiError(403, 'You can only edit your own comments')
    }

    const { data, error } = await supabase
      .from('comments')
      .update({ content: content.trim(), updated_at: new Date().toISOString() })
      .eq('id', commentId)
      .select('*, user:users(id, name, username, avatar)')
      .single()

    if (error) throw error
    return toComment(data)
  } catch (err) {
    console.error('updateComment error:', { commentId, userId, error: err instanceof Error ? err.message : String(err) })
    throw err
  }
}

export async function deleteComment(supabase: SupabaseAdmin, commentId: string, userId: string) {
  try {
    const { data: existing, error: findError } = await supabase
      .from('comments')
      .select('id, user_id')
      .eq('id', commentId)
      .maybeSingle()

    if (findError) throw findError
    if (!existing) throw new ApiError(404, 'Comment not found')
    if (existing.user_id !== userId) {
      throw new ApiError(403, 'You can only delete your own comments')
    }

    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId)

    if (error) throw error
    return { id: commentId }
  } catch (err) {
    console.error('deleteComment error:', { commentId, userId, error: err instanceof Error ? err.message : String(err) })
    throw err
  }
}