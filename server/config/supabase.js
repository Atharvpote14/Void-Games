import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

let adminClient = null

export function setSupabaseAdminClient(client) {
  adminClient = client
}

export function getSupabaseAdmin() {
  if (adminClient) return adminClient

  const url = env.SUPABASE_URL || process.env.SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Supabase credentials are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env'
    )
  }

  adminClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return adminClient
}
