import jsonwebtoken from 'jsonwebtoken';
import sequelize from 'sequelize';
import database from '../../models';

const { User } = database;
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
  const { sessionId, serviceCode, phoneNumber, text } = req.body;
  console.log('ERERERE', req.body);
  let response = '';
  let accountNumber = '';
  let balance = '';
  if (text === '') {
    // This is the first request. Note how we start the response with CON
    response = 'CON What would you want to do? \n 1. Check VRI \n 2. Login';
  } else if (text === '1') {
  // Business logic for first level response
    response = 'CON Do have a PVC? \n 1. Yes \n 2. No';
  } else if (text === '2') {
  // Business logic for first level response
  // This is a terminal request. Note how we start the response with END
    const user = await User.findOne({
      where: {
        phone: phoneNumber
      }
    });
    if (!user) {
      response = 'END You have not registered with this phone number!';
    } else {
      const { surname } = user;
      response = `END Your surname is ${surname}!`;
    }
  } else if (text === '1*1') {
    // This is a second level response where the user selected 1 in the first instance
    // accountNumber = 'ACC1001';
    // This is a terminal request. Note how we start the response with END
    response = 'END Keep it up! Next steps will soon be sent to you!';
  } else if (text === '1*2') {
    // This is a second level response where the user selected 1 in the first instance
    balance = 'NGN 10,000';
    // This is a terminal request. Note how we start the response with END
    response = `END Your balance is ${balance}`;
  }


  return res.status(200).send(response);
}

