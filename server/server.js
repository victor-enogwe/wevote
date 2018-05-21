import { config } from 'dotenv'
import fs from 'fs'
import debug from 'debug'
import path from 'path'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import { execute, subscribe } from 'graphql'
import favicon from 'serve-favicon'
import logger from 'morgan'
import Logger from 'js-logger'
import bodyParser from 'body-parser'
import DataLoader from 'dataloader'
import https from 'https'
import helmet from 'helmet'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { database, graphqlSchema as schema, Question } from './models'
import Routes from './routes'
import { getUser } from './controllers/auth.controller'
import { html, devMiddleware, passport } from './middlewares'

config()
debug('wevote:app')
Logger.useDefaults()

const app = express()
const { NODE_ENV, PORT, HOST_NAME } = process.env

export const isDevMode = NODE_ENV === 'development'

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
export const normalizePort = (val) => {
  const portNumber = parseInt(val, 10)
  if (isNaN(portNumber)) {
    return val
  }

  if (portNumber >= 0) {
    return portNumber
  }
  return false
}

const port = normalizePort(PORT || '3000')

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`)
      process.exit(1)
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`)
      process.exit(1)
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = (server) => {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`
  Logger.debug(`🚧 App is Listening on ${bind}`)
}
const headers1 = 'Origin, X-Requested-With, Content-Type, Accept'
const headers2 = ',Authorization, Access-Control-Allow-Credentials'

app.set('port', port)
app.set('json spaces', 2)
app.set('json replacer', (key, value) => {
  const excludes = ['password', '_raw', '_json', '__v']
  return excludes.includes(key) ? undefined : value
})
app.use(helmet())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', HOST_NAME)
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH')
  res.header('Access-Control-Allow-Headers', `${headers1} ${headers2}`)
  res.header('Access-Control-Allow-Credentials', 'true')
  next()
})
app.use('/public/assets', express.static(path.resolve(__dirname, 'public/assets')))
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(passport.initialize())
app.use('/api/v1/inec', Routes.inec)
app.use('/api/v1/auth', Routes.auth)
app.use('/graphql', (req, res, next) => {
  const query = req.query.query || req.body.query
  const message = 'query size exceeded'
  if (query && query.length > 2000 && !isDevMode) {
    return res.status(500).json({ status: 'error', message })
  }
  next()
}, getUser, (req, res) => graphqlHTTP({
  schema,
  graphiql: isDevMode,
  context: {
    database,
    user: req.user,
    loaders: {
      questionLoader: new DataLoader(keys => Question.find({
        $or: [
          { questionId: { $in: keys.filter(key => typeof key === 'number') } },
          { _id: { $in: keys.filter(key => typeof key !== 'number') } }
        ]
      }).exec())
    }
  },
  formatError: err => ({ message: err.message, status: err.status })
})(req, res))

if (isDevMode) {
  devMiddleware(app)
} else {
  app.use('*', (req, res) => {
    res.set('content-type', 'text/html')
    return res.send(html)
  })
}

database.on('error', () => Logger.info('connection error'))
database.once('open', () => {
  const options = isDevMode ? {
    cert: fs.readFileSync(path.join(__dirname, 'ssl/cert.pem')),
    key: fs.readFileSync(path.join(__dirname, 'ssl/key.pem'))
  } : {}
  const server = https.createServer(options, app)

  server.on('listening', onListening.bind(null, server)).on('error', onError)

  server.listen(port, () => new SubscriptionServer(
    { execute, subscribe, schema }, { server, path: '/graphqlws' }
  ))
})

export default app
