import { createClient } from '@supabase/supabase-js'
import { env } from './env.js'

let adminClient = null

export function getSupabaseAdmin() {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      'Supabase credentials are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in server/.env'
    )
  }

  if (!adminClient) {
    adminClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  }

  return adminClient
}
