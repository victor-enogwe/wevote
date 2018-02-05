import jsonwebtoken from 'jsonwebtoken';
import database from '../../models';

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
export async function ussd(req, res) {
  console.log(req, 'REqueest ......')

  return res.status(200).json({ status: 'success', data: 'Fromm Ussd' });
}

