import 'dotenv/config'

export const env = {
  get NODE_ENV() {
    return process.env.NODE_ENV || 'development'
  },
  get PORT() {
    return Number(process.env.PORT) || 5000
  },
  get CLIENT_ORIGINS() {
    return (process.env.CLIENT_URL || 'http://localhost:5173')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  },
  get SUPABASE_URL() {
    return process.env.SUPABASE_URL || ''
  },
  get SUPABASE_SERVICE_ROLE_KEY() {
    return process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  },
  get JWT_SECRET() {
    return process.env.JWT_SECRET || 'dev-secret-change-me'
  },
}
