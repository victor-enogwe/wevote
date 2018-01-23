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
  return jsonwebtoken.sign(data, JWT_SECRET, { expiresIn: '1h' });
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
  const { email, phone } = req.body;
  const where = {};

  if (email) {
    where.email = email;
  }

  if (phone) {
    where.phone = phone;
  }

  try {
    const user = await User.findOne({ where });
    if (!user) {
      return res.status(404).json({ status: 'fail', message: 'user not found' });
    }

    if (!user.verified) {
      return res.status(401).json({ status: 'fail', message: 'user not verified' });
    }

    const { uuid, password } = user;
    const canLogin = User.comparePassword(req.body.password, password);

    if (!canLogin) {
      return res.status(401).json({ status: 'fail', message: 'authentication failed' });
    }
    const token = generateJwt({ uuid });

    return res.status(200).json({ status: 'success', data: { token } });
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
        const name = data.displayName.split(' ');
        const email = data.emails[0].value;
        const userData = {
          facebookId: data.id,
          email,
          firstname: name[0],
          surname: name[name.length - 1],
          password: req.query.code,
          verified: true
        };

        try {
          let socialAccount = await SocialAccount.findOne({ where: { socialId: data.id } });

          if (!socialAccount) {
            let user = await User.findOne({ where: { email } });

            if (user) {
              if (!user.verified) {
                await user.update({ verified: true });
              }
            } else {
              user = await createUser(userData);
            }

            socialAccount = await SocialAccount.create({
              userUuid: user.uuid, socialId: data.id, email
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
    req.user = await User.findOne({
      where: { uuid: req.decoded.uuid },
      attributes: {
        exclude: ['id', 'createdAt', 'updatedAt']
      }
    });

    if (req.user) {
      return next();
    }
    throw new Error('un-authorized access(udne)');
  } catch (error) {
    return res.status(500).json({ status: 'fail', message: error.message });
  }
}
