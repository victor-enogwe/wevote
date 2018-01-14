'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _models = require('./models/');

var _models2 = _interopRequireDefault(_models);

var _routes = require('./routes/');

var _routes2 = _interopRequireDefault(_routes);

var _logger = require('./config/logger');

var _logger2 = _interopRequireDefault(_logger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv2.default.config();
(0, _debug2.default)('wevote-api');

const app = (0, _express2.default)();

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
const normalizePort = val => {
  const portNumber = parseInt(val, 10);
  if (typeof portNumber !== 'number') {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

const environment = process.env.NODE_ENV || 'production';
const logLevel = environment !== 'production' ? 'dev' : 'common';
const port = normalizePort(process.env.PORT || '5000');
const server = _http2.default.createServer(app);
/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      _logger2.default.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      _logger2.default.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  (0, _debug2.default)(`🚧 App is Listening on ${bind}`);
};
const headers1 = 'Origin, X-Requested-With, Content-Type, Authorization';
const headers2 = 'Accept, Access-Control-Allow-Credentials, x-access-token';
const whitelist = process.env.CLIENT_URL;
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.includes(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

app.set('port', port);
app.use((0, _helmet2.default)());
app.use((0, _cors2.default)(corsOptionsDelegate));
app.use((req, res, next) => {
  const restMethods = 'GET, POST, DELETE, PATCH, OPTIONS, PUT';
  res.header('Access-Control-Allow-Methods', restMethods);
  res.header('Access-Control-Allow-Headers', `${headers1},${headers2}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use((0, _morgan2.default)(logLevel, { stream: _logger2.default.stream }));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());

Object.keys(_routes2.default).map(route => route === 'home' ? app.use('/api/v1/', _routes2.default[route]) : app.use(`/api/v1/${route}`, _routes2.default[route]));

app.use((req, res) => res.status(404).json({
  status: 'error', message: 'This Api route does not exist!'
}));

server.on('listening', onListening);
server.on('error', onError);

_models2.default.sequelize.sync({ ALTER: true }).then(() => server.listen(port)).then(() => _logger2.default.info(`🚧 WeVote Api is Listening on ${port}`)).catch(err => _logger2.default.error(err));

exports.default = app;