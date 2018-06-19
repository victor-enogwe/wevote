'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRegCenters = exports.getPollingUnits = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

/**
 * Get Polling Units co-ordinates from Inec
 *
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @returns {Object} polling units co-ordinates
 */
var getPollingUnits = exports.getPollingUnits = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res) {
    var _req$query, state, lgaId, url, _ref2, data;

    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _req$query = req.query, state = _req$query.state, lgaId = _req$query.lgaId;
            url = 'http://www.inecnigeria.org/wp-content/themes/inec/ndmPHP.php?data=%7B"state"%3A"' + state + '"%2C"lga"%3A"' + lgaId + '"%7D';
            _context.next = 5;
            return _axios2.default.get(url);

          case 5:
            _ref2 = _context.sent;
            data = _ref2.data;
            return _context.abrupt('return', res.status(200).json({ status: 'success', data: data }));

          case 10:
            _context.prev = 10;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', res.status(500).json({ status: 'error', error: _context.t0 }));

          case 13:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 10]]);
  }));

  return function getPollingUnits(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();

/**
 * Get Reg Centers in LGA from Inec
 * needs takes a url query param
 *
 * @export
 * @param {Object} req the request object
 * @param {Object} res the response object
 * @returns {Object} reg centers in an lga
 */


var getRegCenters = exports.getRegCenters = function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res) {
    var _ref4, data;

    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return (0, _axios2.default)({
              url: req.query.url,
              headers: { Accept: 'application/pdf' },
              responseType: 'stream'
            });

          case 3:
            _ref4 = _context2.sent;
            data = _ref4.data;

            res.set('Content-type', 'application/pdf');

            return _context2.abrupt('return', data.pipe(res));

          case 9:
            _context2.prev = 9;
            _context2.t0 = _context2['catch'](0);
            return _context2.abrupt('return', res.status(500).json({ status: 'error', error: _context2.t0 }));

          case 12:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 9]]);
  }));

  return function getRegCenters(_x3, _x4) {
    return _ref3.apply(this, arguments);
  };
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }