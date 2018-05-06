import { config } from 'dotenv'
import fs from 'fs'
import debug from 'debug'
import path from 'path'
import express from 'express'
import graphqlHTTP from 'express-graphql'
import favicon from 'serve-favicon'
import logger from 'morgan'
import Logger from 'js-logger'
import bodyParser from 'body-parser'
import DataLoader from 'dataloader'
import https from 'https'
import helmet from 'helmet'
import { database, graphqlSchema as schema, Question } from './models'
import Routes from './routes'
import { getUser } from './controllers/auth.controller'
import { devMiddleware, passport } from './middlewares'

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
app.use('/api/v1/auth', Routes.auth)
app.use('/graphql', getUser, (req, res) => graphqlHTTP({
  schema,
  graphiql: isDevMode,
  context: {
    database,
    user: req.user,
    loaders: {
      questionLoader: new DataLoader(keys => Question.find({
        _id: { $in: keys }
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
    return res.send(`<!DOCTYPE html>
    <html lang="en">
      <head>
        <title>WE VOTE</title>
        <meta name="viewport" content="width=device-width" />
        <meta charset="UTF-8">
        <meta name="description" content="Check your voter readiness and stay\
informed to ensure you vote" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="vote, election, nigeria" />
        <meta name="author" content="Team WeVote" />
        <title>WeVote - Get Yourself Ready To Vote</title>
        <meta property="og:url"           content="https://wevote-ng.herokuapp.\
com" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="WeVote - Be Vote Ready"/>
        <meta property="og:description" content="Check your voter readiness and\
 stay informed to ensure you vote" />
        <meta property="og:image" content="https://raw.githubusercontent.com/ig\
natiusukwuoma/wevote-client/master/src/assets/nigeria-bgrd.jpg" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=\
Roboto:300,400,500">
      </head>
      <body>
        <div id="vote"></div>
        <script type="text/javascript" src="/public/assets/bundle.js"></script>
      </body>
    </html>
    `)
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

  server.listen(port)
})

export default app
