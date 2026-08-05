export function sendSuccess(res, data = {}, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  })
}

export function sendError(res, statusCode = 500, message = 'Internal server error', error = {}) {
  return res.status(statusCode).json({
    success: false,
    message,
    error,
  })
}
