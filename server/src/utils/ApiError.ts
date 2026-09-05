export class ApiError extends Error {
  public readonly statusCode: number
  public readonly data?: unknown

  constructor(statusCode: number, message: string, data?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.data = data
    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static badRequest(message: string, data?: unknown) {
    return new ApiError(400, message, data)
  }

  static unauthorized(message: string) {
    return new ApiError(401, message)
  }

  static forbidden(message: string) {
    return new ApiError(403, message)
  }

  static notFound(message: string) {
    return new ApiError(404, message)
  }

  static internal(message: string) {
    return new ApiError(500, message)
  }
}

export function isApiError(err: unknown): err is ApiError {
  return err instanceof ApiError
}