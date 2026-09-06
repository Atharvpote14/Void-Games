import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { prettyJSON } from 'hono/pretty-json'
import { logger } from 'hono/logger'
import { HTTPException } from 'hono/http-exception'
import { authRoutes } from './routes/auth.js'
import { gamesRoutes } from './routes/games.js'
import { fixesRoutes } from './routes/fixes.js'
import { guidesRoutes } from './routes/guides.js'
import { categoriesRoutes } from './routes/categories.js'
import { collectionsRoutes } from './routes/collections.js'
import { searchRoutes } from './routes/search.js'
import { usersRoutes } from './routes/users.js'
import { steamFreeRoutes } from './routes/steamFree.js'
import type { SupabaseClient } from '@supabase/supabase-js'

type Env = {
  NODE_ENV: string
  PORT: string
  CLIENT_ORIGINS: string
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  JWT_SECRET: string
  CLIENT_URL: string
}

type Variables = {
  supabase: SupabaseClient<any, 'public', any>
  user: any
  accessToken: string
}

const app = new Hono<{ Bindings: Env; Variables: Variables }>()

// Global middleware
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: (origin: string, c) => {
    const allowed = (c.env.CLIENT_ORIGINS || '').split(',').map((o: string) => o.trim()).filter(Boolean)
    if (!origin || allowed.includes(origin)) return origin
    return allowed[0] || origin
  },
  credentials: true,
  allowHeaders: ['Content-Type', 'Authorization'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  maxAge: 86400,
}))

// Health check (no auth/supabase needed)
app.get('/health', c => c.json({ ok: true, timestamp: new Date().toISOString() }))

// Initialize Supabase client (skip for health)
app.use('*', async (c, next) => {
  if (c.req.path === '/health') return next()
  const { createClient } = await import('@supabase/supabase-js')
  const supabase = createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  c.set('supabase', supabase)
  await next()
})

// API routes
app.route('/api/v1/auth', authRoutes)
app.route('/api/v1/games', gamesRoutes)
app.route('/api/v1/fixes', fixesRoutes)
app.route('/api/v1/guides', guidesRoutes)
app.route('/api/v1/categories', categoriesRoutes)
app.route('/api/v1/collections', collectionsRoutes)
app.route('/api/v1/search', searchRoutes)
app.route('/api/v1/users', usersRoutes)
app.route('/api/v1/steam-free', steamFreeRoutes)

// 404 handler
app.notFound(c => c.json({ success: false, message: 'Not found' }, 404))

// Error handler
app.onError((err, c) => {
  console.error('Error:', err)
  if (err instanceof Response) return err
  if (err instanceof HTTPException) return c.json({ success: false, message: err.message }, err.status)
  if (err instanceof Error) return c.json({ success: false, message: err.message }, 500)
  return c.json({ success: false, message: 'Internal server error' }, 500)
})

export default app