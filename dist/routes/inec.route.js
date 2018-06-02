'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _inec = require('../controllers/inec.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var inec = _express2.default.Router();

inec.get('/', _inec.getPollingUnits);
inec.get('/centers', _inec.getRegCenters);

exports.default = inec;