'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.basicAuth = basicAuth;
exports.verifyToken = verifyToken;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { User } = _models2.default;
/**
 * Basic Authentication
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
async function basicAuth(req, res) {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });
    if (!user) {
      return res.status(404).json({
        status: 'fail',
        message: 'user not found'
      });
    }
    const { uuid, password } = user;
    const canLogin = User.comparePassword(req.body.password, password);

    if (!canLogin) {
      return res.status(401).json({ status: 'fail', message: 'authentication failed' });
    }
    const token = _jsonwebtoken2.default.sign({ uuid }, process.env.JWT_SECRET, { expiresIn: '1h', algorithm: process.env.JWT_ALGO });

    return res.status(200).json({
      status: 'success',
      data: token
    });
  } catch (error) {
    return res.status(500).json({ status: 'fail', error });
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
async function verifyToken(req, res, next) {
  try {
    req.decoded = _jsonwebtoken2.default.verify(req.headers.authorization, process.env.JWT_SECRET);
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
    return res.status(401).json({
      status: 'fail',
      message: error.message
    });
  }
}