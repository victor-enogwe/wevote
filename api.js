import dotenv          from 'dotenv';
import debug           from 'debug';
import express         from 'express';
import httpLogger      from 'morgan';
import bodyParser      from 'body-parser';
import http            from 'http';
import cors            from 'cors';
import helmet          from 'helmet';
import database        from './models/';
import Routes          from './routes/';
import Logger          from './config/logger';

dotenv.config();
debug('wevote-api');

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

const environment = process.env.NODE_ENV || 'production';
const logLevel = environment !== 'production' ? 'dev' : 'common';
const port = normalizePort(process.env.PORT || '5000');
const server = http.createServer(app);
/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = (error) => {
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
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`;
  debug(`🚧 App is Listening on ${bind}`);
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

Object.keys(Routes).map(route => (route === 'home' ? app
  .use('/api/v1/', Routes[route]) : app.use(`/api/v1/${route}`, Routes[route])));

app.use((req, res) => res.status(404).json({
  status: 'error', message: 'This Api route does not exist!'
}));

server.on('listening', onListening);
server.on('error', onError);

database.sequelize.sync({ ALTER: true })
  .then(() => server.listen(port))
  .then(() => Logger
    .info(`🚧 WeVote Api is Listening on ${port}`))
  .catch(err => Logger.error(err));

export default app;
