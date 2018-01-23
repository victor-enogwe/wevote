import jsonwebtoken from 'jsonwebtoken';
import database from '../../models';
import { sendMailSendGrid } from '../../config/email.service';
import { generateJwt } from './auth.controller';

const { ADMIN_EMAIL, API_URL } = process.env;
const { User } = database;

/**
 * Sends an Email Verification mail
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 *
 * @returns {Object} the next response
 */
export async function sendVerificationEmail(req, res) {
  try {
    const { email } = req.query;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('user does not exist');
    } else if (user.verified) {
      return res.status(400).json({ status: 'fail', message: 'user already verified' });
    }
    // const subject = 'Verify You Email on We Vote!';
    const code = generateJwt({ email });
    console.log(code);
    // const message = '';
    // await sendMailSendGrid(
    //   req.query.email,
    //   ADMIN_EMAIL,
    //   subject,
    //   'Thank you for creating an account on We Vote!',
    //   message,
    //   'e3ebdf2f-9ce1-4337-b5d0-2f3130089cac',
    //   {
    //     verificationLink: `${API_URL}/api/v1/email/update-verification?code=${code}`
    //   }
    // );

    return res.status(200).json({ status: 'success', message: 'email sent!' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
}

/**
 * Verifies a user via email
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 *
 * @returns {Object} the next response
 */
export async function verifyEmail(req, res) {
  try {
    const { code } = req.query;
    const valid = jsonwebtoken.verify(code, process.env.JWT_SECRET);

    if (!valid) {
      throw new Error(valid);
    }

    const { email } = jsonwebtoken.decode(code);
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error('user does not exist');
    } else if (user.verified) {
      return res.status(400).json({ status: 'fail', message: 'user already verified' });
    }

    await user.update({ verified: true });

    return res.status(200).json({ status: 'success', message: 'user account verified' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: 'invalid verification link' });
  }
}
