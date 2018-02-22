import jsonwebtoken from 'jsonwebtoken';
import database from '../../models';
import passport from '../../config/passport';
import { createUser } from './user.controller';

const { User, SocialAccount } = database;
const { JWT_SECRET } = process.env;

/**
 * generate Jwt
 *
 * @export
 *
 * @param {any} data the data to sign
 *
 * @returns {object} the jwt token
 */
export function generateJwt(data) {
  return jsonwebtoken.sign(data, JWT_SECRET, { expiresIn: '12h' });
}

/**
 * Basic Authentication
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
export async function basicAuth(req, res) {
  const { phone, surname } = req.body;
  const where = {};

  if (phone && surname) {
    where.phone = phone;
    where.surname = surname;
  }

  try {
    const user = await User.findOne({ where });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'user not found' });
    }

    const { uuid } = user;
    const token = generateJwt({ uuid });

    return res.status(200).json({ status: 'success', data: { token } });
  } catch (error) {
    return res.status(500).json({ status: 'fail', error });
  }
}

/**
 * Confirm user phone number
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
export async function confirm(req, res) {
  const { phone } = req.body;
  const where = {};

  if (phone) {
    where.phone = phone;
  }

  try {
    const user = await User.findOne({ where });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'user not found' });
    }
    const { surname } = user;
    return res.status(200).json({ status: 'success', data: { surname } });
  } catch (error) {
    return res.status(500).json({ status: 'fail', error });
  }
}

/**
 * Facebook Authentication
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
export function facebookAuth(req, res) {
  return passport
    .authenticate('facebook', async (error, data) => {
      if (!error) {
        const provider = 'facebook';
        const name = data.displayName.split(' ');
        const email = data.emails[0].value;

        try {
          let socialAccount = await SocialAccount.findOne({
            where: { socialId: data.id, provider }
          });

          if (!socialAccount) {
            let user = await User.findOne({ where: { email } });

            if (user) {
              if (!user.verified) {
                await user.update({ verified: true });
              }
            } else {
              const userData = {
                email,
                firstname: name[0],
                surname: name[name.length - 1],
                password: req.query.code,
                verified: true
              };
              user = await createUser(userData);
            }

            socialAccount = await SocialAccount.create({
              userUuid: user.uuid, socialId: data.id, email, provider
            });
          }

          const token = generateJwt({ uuid: socialAccount.userUuid });

          return res.status(200).json({ status: 'success', data: { token } });
        } catch (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }
      }

      return res.status(500).json({ status: 'error', message: error.message });
    })(req, res);
}

/**
 * Twitter Authentication
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
export function twitterAuth(req, res) {
  return passport
    .authenticate('twitter', async (error, data) => {
      if (!error) {
        const provider = 'twitter';
        const name = data.displayName.split(' ');
        const email = data.emails[0].value;

        try {
          let socialAccount = await SocialAccount.findOne({
            where: {
              socialId: data.id, provider
            }
          });

          if (!socialAccount) {
            let user = await User.findOne({ where: { email } });
            if (user) {
              if (!user.verified) {
                await user.update({ verified: true });
              }
            } else {
              const userData = {
                email,
                firstname: name[0],
                surname: name[name.length - 1],
                password: req.query.oauth_token,
                verified: true
              };
              user = await createUser(userData);
            }

            socialAccount = await SocialAccount.create({
              userUuid: user.uuid, socialId: data.id, email, provider
            });
          }

          const token = generateJwt({ uuid: socialAccount.userUuid });

          return res.status(200).json({ status: 'success', data: { token } });
        } catch (err) {
          return res.status(500).json({ status: 'error', message: err.message });
        }
      }

      return res.status(500).json({ status: 'error', message: error.message });
    })(req, res);
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
export async function verifyToken(req, res, next) {
  try {
    req.decoded = jsonwebtoken.verify(req.headers.authorization, process.env.JWT_SECRET);

    return next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Set the user for the request
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Object} next the next function
 *
 * @returns {Object} the next response
 */
export async function setUser(req, res, next) {
  try {
    req.user = await User.findOne({
      where: { uuid: req.decoded.uuid },
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'password']
      }
    });
    if (req.user) {
      return next();
    }

    throw new Error('udne, unauthorized access');
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Checks if a user has a role
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback function
 *
 * @returns {Object} the next response
 */
export async function setRole(req, res, next) {
  try {
    const { user } = req;
    const [role] = await user.getRoles();

    if (role) {
      req.role = role.name;
      return next();
    }

    throw new Error('unauthorized access! role not found');
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Checks if user role is in alowed roles
 *
 * @export
 * @param {array} allowedRoles the allowed roles
 * @param {string} role the role
 *
 * @returns {boolean} truthy or falsy value
 */
export function checkRole(allowedRoles, role) {
  try {
    return allowedRoles.includes(role);
  } catch (error) {
    throw error;
  }
}

/**
 * Check Resource Ownership
 *
 * @export
 * @param {string} creatorId the creator id
 * @param {string} userId the user id
 *
 * @returns {boolean} truthy or falsy value
 */
export function checkOwnership(creatorId, userId) {
  try {
    return creatorId === userId;
  } catch (error) {
    throw error;
  }
}
/**
 * Check If User is superUser or Admin
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response object
 *  @param {Function} next the callback
 *
 * @returns {object} the response object
 */
export function isAdminOrSuperUser(req, res, next) {
  try {
    const { role } = req;
    if (!role) {
      throw new Error('role not present huh!');
    } else if (!['ADMIN', 'SUPER_USER'].includes(req.role)) {
      throw new Error('unauthorized access');
    }

    return next();
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}
