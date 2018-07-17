import passport from './passport.middleware'
import {
  devMiddleware,
  errorFourZeroFourMiddleware,
  httpErrorMiddleware,
  httpRequestLoggingMiddleware,
  setHeadersMiddleware,
  healthCheckMiddleware,
  graphqlExpressMiddleware,
  checkQuerySizeMiddleware,
  filterKeysMiddleware,
  frontendMiddleware
} from './express.middleware'
import {
  authFields,
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdmin,
  grantAccessAdminOrOwner,
  grantAccessUser,
  grantAccessOwner
} from './graphql.middleware'

export function catchBlock (devMode, callback, errorCb) {
  try {
    return callback()
  } catch (error) {
    if (devMode) {
      throw error
    }

    if (errorCb) {
      errorCb()
    }
    throw new Error(error.message)
  }
}

module.exports = {
  passport,
  devMiddleware,
  errorFourZeroFourMiddleware,
  httpErrorMiddleware,
  httpRequestLoggingMiddleware,
  setHeadersMiddleware,
  healthCheckMiddleware,
  graphqlExpressMiddleware,
  checkQuerySizeMiddleware,
  filterKeysMiddleware,
  frontendMiddleware,
  authFields,
  modifyResolver,
  setGlobalResolvers,
  grantAccessAdmin,
  grantAccessAdminOrOwner,
  grantAccessUser,
  grantAccessOwner
}
