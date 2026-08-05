import { sendError } from '../utils/ApiResponse.js'

export const notFound = (req, res) => {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`)
}
