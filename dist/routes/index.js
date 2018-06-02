'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _inec = require('./inec.route');

var _inec2 = _interopRequireDefault(_inec);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  auth: _auth2.default, inec: _inec2.default
};