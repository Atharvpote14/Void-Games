import { env } from '../config/env.js'
import { ApiError } from '../utils/ApiError.js'
import { sendError } from '../utils/ApiResponse.js'

export const errorHandler = (err, _req, res, _next) => {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  if (err instanceof ApiError && err.isOperational) {
    statusCode = err.statusCode
    message = err.message
  }

  if (err.type === 'entity.parse.failed') {
    statusCode = 400
    message = 'Invalid JSON payload'
  }

  if (statusCode >= 500) {
    message = 'Internal server error'
  }

  const error =
    env.NODE_ENV === 'development' && statusCode >= 500
      ? { stack: err.stack, details: err.message }
      : {}

  sendError(res, statusCode, message, error)
}
