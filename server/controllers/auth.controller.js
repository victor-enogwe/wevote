import jsonwebtoken from 'jsonwebtoken'
import { Role } from '../models'

const { JWT_SECRET } = process.env

export async function assignRole (req, res, next) {
  try {
    if (!req.user.roleId) {
      const { doc: { _id: roleId, title } } = await Role
        .findOrCreate({ title: 'USER' })
      await req.user.update({ roleId })
      req.user.roleDetails = { title }
    } else {
      const { title } = await Role.findById(req.user.roleId)
      req.user.roleDetails = { title }

      return next()
    }
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}
/**
 * generate Jwt
 *
 * @export
 *
 * @param {object} req the request object
 * @param {object} res the response object
 *
 * @returns {object} the jwt token
 */
export function generateJwt (req, res) {
  try {
    const { _id, roleDetails } = req.user
    const token = jsonwebtoken
      .sign({ _id, roleDetails }, JWT_SECRET, { expiresIn: '1h' })

    return res.redirect(`/login?token=${token}`)
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message })
  }
}

/**
 * Checks if a user is Logged token is valid
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} the next response
 */
export function getUser (req, res, next) {
  try {
    req.user = jsonwebtoken.verify(req.headers.authorization, JWT_SECRET)

    return next()
  } catch (error) {
    const { message } = error
    const statusCode = message === 'jwt expired' ? 401 : 500
    const status = message === 'jwt expired' ? 'fail' : 'error'

    if (req.headers.authorization) {
      return res.status(statusCode).json({ status, message })
    }

    req.user = { _id: null, roleDetails: { title: 'GUEST' } }

    return next()
  }
}

export default getUser
