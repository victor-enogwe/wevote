import { load } from 'dotenv'
import passport from 'passport'
import path from 'path'
import express, { static as publicPath } from 'express'
import { execute, subscribe } from 'graphql'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import favicon from 'serve-favicon'
import http from 'http'
import helmet from 'helmet'
import { authMiddleware, inecMiddleware } from './routes'
import { getUser } from './controllers/auth.controller'
import logger from './logs'
import { database, graphqlSchema as schema } from './models'
import { onListening, onError, normalizePort, isDevMode } from './utils'
import {
  devMiddleware,
  setHeadersMiddleware,
  checkQuerySizeMiddleware,
  graphqlExpressMiddleware,
  healthCheckMiddleware,
  filterKeysMiddleware,
  frontendMiddleware,
  errorFourZeroFourMiddleware,
  httpErrorMiddleware,
  httpRequestLoggingMiddleware
} from './middlewares'

load()

const app = express()
const { PORT } = process.env
const server = http.createServer(app)
const port = normalizePort(isDevMode ? 4000 : (PORT || 4000))

devMiddleware(app, isDevMode)
app.set('port', port)
app.set('json spaces', 2)
app.set('json replacer', filterKeysMiddleware)
app.options('*', setHeadersMiddleware)
app.use(helmet())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(httpRequestLoggingMiddleware)
app.use(publicPath(path.resolve(__dirname, '../dist/client')))
app.use(favicon(path.join(__dirname, '../favicon.ico')))
app.use(passport.initialize())
app.use('/api/v1/inec', inecMiddleware)
app.use('/api/v1/auth', authMiddleware)
app.use('/graphql', checkQuerySizeMiddleware, getUser, graphqlExpressMiddleware)
app.get('/health-check', healthCheckMiddleware)
app.get('*', frontendMiddleware)
app.use(errorFourZeroFourMiddleware)
app.use(httpErrorMiddleware)

server.on('listening', onListening.bind(null, server)).on('error', onError)

// Only run this section if file is loaded directly (eg `node wirebot.js`)
// module loaded by something else eg. test or cyclic dependency
// Fixes error: "Trying to open unclosed connection."
if (require.main === module) {
  database.on('error', () => {
    logger.error('database connection error')
    process.exit(0)
  })

  database.once('open', () => server
    .listen(port, () => new SubscriptionServer(
      { execute, subscribe, schema }, { server, path: '/graphqlws' }
    )))
}

module.exports = { app, server }
