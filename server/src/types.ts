import type { SupabaseClient } from '@supabase/supabase-js'
import { Hono } from 'hono'

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

export type AppContext = { Bindings: AppEnv; Variables: AppVariables }

export const createRouter = () => new Hono<AppContext>()