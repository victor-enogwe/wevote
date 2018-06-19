'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.assignRole = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

/**
 * Assign User roles
 *
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @param {Function} next the callback
 * @returns {Function} the callback if successful
 */
var assignRole = exports.assignRole = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var _ref2, roleId;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;

            if (req.user.roleId) {
              _context.next = 8;
              break;
            }

            _context.next = 4;
            return _models.Role.findOrCreate({ title: 'USER' });

          case 4:
            _ref2 = _context.sent;
            roleId = _ref2.doc._id;
            _context.next = 8;
            return req.user.update({ roleId: roleId });

          case 8:
            return _context.abrupt('return', next());

          case 11:
            _context.prev = 11;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', res.status(500).json({ status: 'error', message: _context.t0.message }));

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 11]]);
  }));

  return function assignRole(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

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


exports.generateJwt = generateJwt;
exports.getUser = getUser;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var JWT_SECRET = process.env.JWT_SECRET;
function generateJwt(req, res) {
  try {
    var _id = req.user._id;

    var token = _jsonwebtoken2.default.sign({ _id: _id }, JWT_SECRET, { expiresIn: '1h' });

    return res.redirect('/login?token=' + token);
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
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
function getUser(req, res, next) {
  try {
    req.user = _jsonwebtoken2.default.verify(req.headers.authorization, JWT_SECRET);

    return next();
  } catch (error) {
    var message = error.message;

    var statusCode = message === 'jwt expired' ? 401 : 500;
    var status = message === 'jwt expired' ? 'fail' : 'error';

    if (req.headers.authorization) {
      return res.status(statusCode).json({ status: status, message: message });
    }

    req.user = { _id: null };

    return next();
  }
}

exports.default = getUser;