'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.normalizePort = exports.isDevMode = undefined;

var _dotenv = require('dotenv');

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _expressGraphql = require('express-graphql');

var _expressGraphql2 = _interopRequireDefault(_expressGraphql);

var _graphql = require('graphql');

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _jsLogger = require('js-logger');

var _jsLogger2 = _interopRequireDefault(_jsLogger);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _dataloader = require('dataloader');

var _dataloader2 = _interopRequireDefault(_dataloader);

var _https = require('https');

var _https2 = _interopRequireDefault(_https);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _models = require('./models');

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

var _auth = require('./controllers/auth.controller');

var _middlewares = require('./middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(0, _dotenv.config)();
(0, _debug2.default)('wevote:app');
_jsLogger2.default.useDefaults();

var app = (0, _express2.default)();
var _process$env = process.env,
    NODE_ENV = _process$env.NODE_ENV,
    PORT = _process$env.PORT,
    HOST_NAME = _process$env.HOST_NAME;
var isDevMode = exports.isDevMode = NODE_ENV === 'development';

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
var normalizePort = exports.normalizePort = function normalizePort(val) {
  var portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

var port = normalizePort(PORT || '3000');

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
var onError = function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      _jsLogger2.default.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      _jsLogger2.default.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
var onListening = function onListening(server) {
  var addr = server.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  _jsLogger2.default.debug('\uD83D\uDEA7 App is Listening on ' + bind);
};
var headers1 = 'Origin, X-Requested-With, Content-Type, Accept';
var headers2 = ',Authorization, Access-Control-Allow-Credentials';

app.set('port', port);
app.set('json spaces', 2);
app.set('json replacer', function (key, value) {
  var excludes = ['password', '_raw', '_json', '__v'];
  return excludes.includes(key) ? undefined : value;
});
app.use((0, _helmet2.default)());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', HOST_NAME);
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', headers1 + ' ' + headers2);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use('/public/assets', _express2.default.static(_path2.default.resolve(__dirname, 'public/assets')));
app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, '../favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use(_bodyParser2.default.json());
app.use(_middlewares.passport.initialize());
app.use('/api/v1/inec', _routes2.default.inec);
app.use('/api/v1/auth', _routes2.default.auth);
app.use('/graphql', function (req, res, next) {
  var query = req.query.query || req.body.query;
  var message = 'query size exceeded';
  if (query && query.length > 2000 && !isDevMode) {
    return res.status(500).json({ status: 'error', message: message });
  }
  next();
}, _auth.getUser, function (req, res) {
  return (0, _expressGraphql2.default)({
    schema: _models.graphqlSchema,
    graphiql: isDevMode,
    context: {
      database: _models.database,
      user: req.user,
      loaders: {
        questionLoader: new _dataloader2.default(function (keys) {
          return _models.Question.find({
            $or: [{ questionId: { $in: keys.filter(function (key) {
                  return typeof key === 'number';
                }) } }, { _id: { $in: keys.filter(function (key) {
                  return typeof key !== 'number';
                }) } }]
          }).exec();
        })
      }
    },
    formatError: function formatError(err) {
      return { message: err.message, status: err.status };
    }
  })(req, res);
});

if (isDevMode) {
  (0, _middlewares.devMiddleware)(app);
} else {
  app.use('*', function (req, res) {
    res.set('content-type', 'text/html');
    return res.send(_middlewares.html);
  });
}

_models.database.on('error', function () {
  return _jsLogger2.default.info('connection error');
});
_models.database.once('open', function () {
  var options = isDevMode ? {
    cert: _fs2.default.readFileSync(_path2.default.join(__dirname, 'ssl/cert.pem')),
    key: _fs2.default.readFileSync(_path2.default.join(__dirname, 'ssl/key.pem'))
  } : {};
  var server = _https2.default.createServer(options, app);

  server.on('listening', onListening.bind(null, server)).on('error', onError);

  server.listen(port, function () {
    return new _subscriptionsTransportWs.SubscriptionServer({ execute: _graphql.execute, subscribe: _graphql.subscribe, schema: _models.graphqlSchema }, { server: server, path: '/graphqlws' });
  });
});

exports.default = app;