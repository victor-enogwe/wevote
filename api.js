import compression     from 'compression';
import dotenv          from 'dotenv';
import express         from 'express';
import session         from 'express-session';
import httpLogger      from 'morgan';
import bodyParser      from 'body-parser';
import http            from 'http';
import https           from 'https';
import cors            from 'cors';
import responseTime    from 'response-time';
import helmet          from 'helmet';
import database        from './models/';
import Routes          from './routes/';
import Logger          from './config/logger';

dotenv.config();

const { NODE_ENV, TWITTER_CONSUMER_SECRET, PORT } = process.env;
const app = express();

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
const normalizePort = (val) => {
  const portNumber = parseInt(val, 10);
  if (typeof portNumber !== 'number') {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

const environment = NODE_ENV || 'production';
const logLevel = environment !== 'production' ? 'dev' : 'common';
const port = normalizePort(PORT || '5000');
const server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 *
 * @param {any} error an error message
 *
 * @returns {null} error already thrown
 */
function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 *
 * @returns {null} server process is continous here, so no returns
 */
function onListening() {
  const serverDetails = server.address();
  const protocol = `http${(server instanceof https.Server ? 's' : '')}`;
  const bind = typeof addr === 'string'
    ? `pipe ${serverDetails}`
    : `port ${port}`;
  const { address } = serverDetails;
  return Logger.info(`🚧 WeVote Api is Listening on ${protocol}://${address} ${bind}`);
}

/**
 * Error 404 Handler for APi
 *
 * @param {Object} req the http request obbject
 * @param {Object} res the http response object
 *
 * @returns {Object} the response
 */
function error404Handler(req, res) {
  return res.status(404).json({
    status: 'error', message: 'This Api route does not exist!'
  });
}

/**
 * Error Handler for APi
 *
 * @param {Object} error the error object
 * @param {Object} req the http request obbject
 * @param {Object} res the http response object
 * @param {Function} next the callback
 *
 * @returns {Object} the response
 */
function genericErrorHandler(error, req, res) {
  const isProduction = environment === 'production' || false;
  const { status, message } = error;

  if (isProduction) {
    return res.status(status).json({ status: 'error', message });
  }

  return res.status(status).json({ status: 'error', error });
}

const headers1 = 'Origin, X-Requested-With, Content-Type';
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
app.set('json spaces', 2);
app.set('json replacer', (key, value) => {
  const excludes = ['password', '_raw', '_json'];

  return excludes.includes(key) ? undefined : value;
});
app.use(compression());
app.use(helmet());
app.use(cors(corsOptionsDelegate));
app.use((req, res, next) => {
  const restMethods = 'GET, POST, DELETE, PATCH, OPTIONS, PUT';
  res.header('Access-Control-Allow-Methods', restMethods);
  res.header('Access-Control-Allow-Headers', `${headers1},${headers2}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use(httpLogger(logLevel, { stream: Logger.stream }));
app.use(session({
  secret: TWITTER_CONSUMER_SECRET,
  resave: false,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(responseTime({ digits: 4 }));

Object.keys(Routes).map(route => (route === 'home' ? app
  .use('/api/v1/', Routes[route]) : app.use(`/api/v1/${route}`, Routes[route])));

app.use(error404Handler);
app.use(genericErrorHandler);

server.on('listening', onListening);
server.on('error', onError);

database.sequelize.sync()
  .then(() => server.listen(port))
  .catch(err => Logger.error(err));

export default app;
