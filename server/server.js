import app from './app.js'
import { env } from './config/env.js'

const server = app.listen(env.PORT, () => {
  console.log(
    `[void-games-api] running in ${env.NODE_ENV} mode on port ${env.PORT}`
  )
})

function shutdown(signal) {
  console.log(`[void-games-api] received ${signal}, shutting down...`)
  server.close(() => process.exit(0))
  setTimeout(() => process.exit(1), 10000).unref()
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))
