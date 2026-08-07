import {
  listAdminUsers,
  getAdminUser,
  updateAdminUser,
  deleteAdminUser,
} from '../services/adminUsersService.js'
import { ApiError } from '../utils/ApiError.js'
import { validateUuid } from '../validations/userValidation.js'

const VALID_ROLES = ['user', 'admin']

function validateUserUpdates(body) {
  const clean = {}

  if (body.role !== undefined) {
    if (!VALID_ROLES.includes(body.role)) {
      throw new ApiError(400, 'Role must be either "user" or "admin"')
    }
    clean.role = body.role
  }

  if (body.is_banned !== undefined) {
    if (typeof body.is_banned !== 'boolean') {
      throw new ApiError(400, 'is_banned must be a boolean')
    }
    clean.is_banned = body.is_banned
  }

  return clean
}

export async function getUsers(req, res, next) {
  try {
    const users = await listAdminUsers(req.query)
    res.json({
      success: true,
      message: 'Users fetched successfully',
      data: users,
    })
  } catch (err) {
    next(err)
  }
}

export async function getUser(req, res, next) {
  try {
    const user = await getAdminUser(req.params.id)
    res.json({
      success: true,
      message: 'User fetched successfully',
      data: user,
    })
  } catch (err) {
    next(err)
  }
}

export async function updateUser(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid user id is required')
    }
    if (id === req.user.id) {
      throw new ApiError(400, 'You cannot modify your own account')
    }
    const updates = validateUserUpdates(req.body)
    if (Object.keys(updates).length === 0) {
      throw new ApiError(400, 'No valid updates provided')
    }
    const updated = await updateAdminUser(id, updates)
    res.json({
      success: true,
      message: 'User updated successfully',
      data: updated,
    })
  } catch (err) {
    next(err)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const { id } = req.params
    if (!validateUuid(id)) {
      throw new ApiError(400, 'A valid user id is required')
    }
    if (id === req.user.id) {
      throw new ApiError(400, 'You cannot delete your own account')
    }
    await deleteAdminUser(id)
    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
