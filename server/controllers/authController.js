import { loginWithAccessToken } from '../services/authService.js'

export async function login(req, res, next) {
  try {
    const { token } = req.body
    const profile = await loginWithAccessToken(token)
    res.json({
      success: true,
      message: 'Signed in successfully',
      data: profile,
    })
  } catch (err) {
    next(err)
  }
}

export async function getMe(req, res, next) {
  try {
    res.json({
      success: true,
      message: 'Profile fetched successfully',
      data: req.user,
    })
  } catch (err) {
    next(err)
  }
}

export async function logout(_req, res, next) {
  try {
    res.json({
      success: true,
      message: 'Signed out successfully',
      data: {},
    })
  } catch (err) {
    next(err)
  }
}
