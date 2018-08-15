import morgan from 'morgan'
import path from 'path'
import graphqlHTTP from 'express-graphql'
import DataLoader from 'dataloader'
import { database, graphqlSchema as schema, Question } from '../models'
import logger from '../logs'
import { logServiceError, isDevMode } from '../utils'

const { ALLOWED_ORIGINS, API_URL, APP_URL } = process.env

/**
 * Filter Express Keys
 *
 * @export
 * @param {String} key express req/res body/query/params object
 * @param {any} value key value
 * @returns {any} undefined or value
 */
export function filterKeysMiddleware (key, value) {
  const excludes = ['password', '_raw', '_json', '__v']

  return excludes.includes(key) ? undefined : value
}

/**
 * 404 Error Middlware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
export function checkQuerySizeMiddleware (req, res, next) {
  const query = req.query.query || req.body.query
  const message = 'query size exceeded'
  if (query && query.length > 2000 && !isDevMode) {
    return res.status(500).json({ status: 'error', message })
  }
  next()
}

/**
 * GraphQl Middleware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json response
 */
export function graphqlExpressMiddleware (req, res) {
  return graphqlHTTP({
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
  })(req, res)
}

/**
 * wevotes Http Request Logging Middlware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
export function httpRequestLoggingMiddleware (req, res, next) {
  return morgan('combined', {
    immediate: true, stream: { write: msg => logger.info(msg.trim()) }
  })(req, res, next)
}

/**
 * Set Http Headers Middlware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
export function setHeadersMiddleware (req, res) {
  const allowedOrigins = [ALLOWED_ORIGINS.split(','), API_URL, APP_URL]
  const allowedOrigin = allowedOrigins.includes(req.headers.origin)
  const headers1 = 'Origin, X-Requested-With, Content-Type, Accept'
  const headers2 = ',Authorization, Access-Control-Allow-Credentials'
  if (ALLOWED_ORIGINS) res.header('Access-Control-Allow-Origin', allowedOrigin)
  res.header('Access-Control-Allow-Methods', 'GET, POST')
  res.header('Access-Control-Allow-Headers', `${headers1} ${headers2}`)
  res.header('Access-Control-Allow-Credentials', 'true')

  return res.status(204)
}

/**
 * 404 Error Middlware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 * @param {Function} next the next middleware function
 *
 * @returns {Object} the next middleware function
 */
export function errorFourZeroFourMiddleware (req, res, next) {
  const error = new Error('WeVote Route Does Not Exist')
  error.status = 404

  return next(error)
}

/**
 * Express Error Middleware
 *
 * @export
 * @param {Object} error the error object
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the error in json
 */
export function httpErrorMiddleware (error, req, res, next) {
  const { status = 500, message } = error
  error.response = {
    status,
    request: {
      ...req,
      path: req.path,
      agent: { protocol: req.protocol },
      res: {
        httpVersion: req.httpVersion,
        headers: { date: req._startTime },
        client: { servername: req.hostname }
      }
    }
  }

  logServiceError(error)

  return res.status(status).json({ status, error: message })
}

/**
 * Wevote Health Check Middleware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the http json server up response
 */
export function healthCheckMiddleware (req, res) {
  return res.status(200).json({ status: 200, message: 'wevote server up' })
}

/**
 * Wevote Home Middleware
 *
 * @export
 * @param {Object} req the http request object
 * @param {Object} res the http response object
 *
 * @returns {Object} the html response
 */
export function frontendMiddleware (req, res) {
  return res.sendFile(path.resolve(__dirname, '../../dist/client/index.html'))
}
