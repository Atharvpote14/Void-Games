export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: Number(process.env.PORT) || 5000,
  CLIENT_ORIGINS: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((origin: string) => origin.trim())
    .filter(Boolean),
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-me',
}

export async function getSupabaseAdmin(env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string }) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase credentials are missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY')
  }
  const { createClient } = await import('@supabase/supabase-js')
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
}