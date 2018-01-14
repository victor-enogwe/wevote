'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const routes = {};
_fs2.default.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file !== 'index.js').forEach(file => {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const route = require(`./${file}`).default;
  routes[file.split(/\./)[0]] = route;
});

exports.default = routes;