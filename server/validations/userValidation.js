const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export function validateUuid(value) {
  return typeof value === 'string' && UUID_REGEX.test(value)
}

export function validateProfileUpdate(body = {}) {
  const clean = {}

  if (body.name !== undefined) {
    const name = String(body.name).trim()
    if (name.length < 2 || name.length > 60) {
      throw new Error('Name must be between 2 and 60 characters')
    }
    clean.name = name
  }

  if (body.username !== undefined) {
    const username = String(body.username).trim().replace(/^@/, '')
    if (!/^[a-zA-Z0-9_.]{3,30}$/.test(username)) {
      throw new Error(
        'Username must be 3-30 characters using letters, numbers, underscores or dots'
      )
    }
    clean.username = username
  }

  if (body.bio !== undefined) {
    const bio = String(body.bio).trim()
    if (bio.length > 300) {
      throw new Error('Bio must be 300 characters or fewer')
    }
    clean.bio = bio
  }

  if (body.country !== undefined) {
    const country = String(body.country).trim()
    if (country.length > 60) {
      throw new Error('Country must be 60 characters or fewer')
    }
    clean.country = country
  }

  if (body.avatar !== undefined) {
    const avatar = String(body.avatar).trim()
    if (avatar.length > 500) {
      throw new Error('Avatar URL is too long')
    }
    clean.avatar = avatar
  }

  return clean
}
