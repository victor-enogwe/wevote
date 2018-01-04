'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = require('winston');

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_winston2.default.emitErrs = true;

const logger = new _winston2.default.Logger({
  transports: [new _winston2.default.transports.File({
    level: 'info',
    filename: './logs/all-logs.log',
    handleExceptions: true,
    json: true,
    maxsize: 5242880, // 5MB
    maxFiles: 5,
    colorize: true
  }), new _winston2.default.transports.Console({
    level: 'debug',
    handleExceptions: true,
    json: false,
    colorize: true
  })],
  exitOnError: false
});

logger.stream = {
  write(message) {
    return logger.info(message);
  }
};

exports.default = logger;