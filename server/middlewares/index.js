import devMiddleware from './dev.middleware'
import passport from './passport.middleware'
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

module.exports.passport = passport
module.exports.devMiddleware = devMiddleware
module.exports.authFields = authFields
module.exports.modifyResolver = modifyResolver
module.exports.setGlobalResolvers = setGlobalResolvers
module.exports.grantAccessAdmin = grantAccessAdmin
module.exports.grantAccessAdminOrOwner = grantAccessAdminOrOwner
module.exports.grantAccessUser = grantAccessUser
module.exports.grantAccessOwner = grantAccessOwner
