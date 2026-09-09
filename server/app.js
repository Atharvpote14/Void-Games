import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from './config/env.js'
import routes from './routes/index.js'
import { apiRateLimiter } from './middleware/rateLimiter.js'
import { notFound } from './middleware/notFound.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.CLIENT_ORIGINS.includes(origin)) {
        callback(null, true)
      } else {
        callback(null, false)
      }
    },
    credentials: true,
  })
)
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'))

app.use('/api/v1', apiRateLimiter)
app.use('/api/v1', routes)

// Serve static client files in production
// Serve the built client assets (assumes `client/dist` contains the build output)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const clientDist = path.resolve(__dirname, '..', 'client', 'dist')
app.use(express.static(clientDist))

// Fallback: serve index.html for any non-API route (including /admin/*)
app.use((req, res) => {
  // Serve the SPA entry point for any non-API request
  res.sendFile(path.join(clientDist, 'index.html'))
})

app.use(notFound)
app.use(errorHandler)

export default app
