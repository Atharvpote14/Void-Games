import type { SupabaseClient } from '@supabase/supabase-js'

export type AppVariables = {
  supabase: SupabaseClient<any, 'public', any>
  user: any
  accessToken: string
}

export type AppEnv = {
  NODE_ENV: string
  PORT: string
  CLIENT_ORIGINS: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
  CLIENT_URL: string
}

import { Hono } from 'hono'

export const app = new Hono<{ Bindings: AppEnv; Variables: AppVariables }>()