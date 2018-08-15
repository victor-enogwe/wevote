import logger from '../logs'

const { NODE_ENV } = process.env
export const isDevMode = NODE_ENV === 'development'
export const isTestMode = NODE_ENV === 'test'
export const isProdMode = NODE_ENV === 'production'

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
export function normalizePort (val) {
  const portNumber = parseInt(val, 10)
  if (isNaN(portNumber)) {
    return val
  }

  if (portNumber >= 0) {
    return portNumber
  }
  return false
}

/**
* Event listener for HTTP server "listening" event.
 *
 * @param {Object} server the http server instance
 *
 * @returns {null} server process is continous here, so no returns
 */
export function onListening (server) {
  const addr = server.address()
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
    : `port ${addr.port}`

  logger.info(`🚧 WeVote is Listening on ${bind}`)
}

/**
 * Event listener for HTTP server "error" event.
 * @param {Error} error an error message
 * @returns {null} error already logged exits process
 */
export function onError (error) {
  if (error.syscall !== 'listen') {
    return logger.error(error.message)
  }

  switch (error.code) {
    case 'EACCES':
      logger.error('port requires elevated privileges')
      return isTestMode || process.exit(1)
    case 'EADDRINUSE':
      logger.error('port is already in use')
      return isTestMode || process.exit(1)
    default:
      return logger.error(error.message)
  }
}

/**
 * Http Error
 * @typedef {Object} HttpError
 * @property {string} code - The error message
 * @property {string} message - The error code
 * @property {string} response - Http response
 */

/**
 * Service Error Handler
 *
 * @param {HttpError} error the error object
 *
 * @returns {Object} winston log info
 */
export function logServiceError (error) {
  const { message, code } = error
  let logMsg = ''
  if (error.response) {
    const { status, request, request: { res } } = error.response
    const { method, path, agent: { protocol }, headers } = request
    const { httpVersion, headers: { date }, client: { servername } } = res
    const ua = headers ? headers['user-agent'] : 'WeVote 1.0'
    logMsg = `::1 - - [${date}] "${method} ${path} HTTP/${httpVersion}" `
    logMsg += `${status} - "${message || ''} ${code || ''}" ${ua}"`
    logMsg += ` - "WeVote (+${protocol}//${servername})`
  } else {
    const stack = process.env.NODE_ENV === 'development' ? error.stack : ''
    logMsg = `${error.message} ${error.code || stack}`
  }

  return logger.error(logMsg)
}
