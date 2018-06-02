'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.catchBlock = catchBlock;

var _dev = require('./dev.middleware');

var _dev2 = _interopRequireDefault(_dev);

var _passport = require('./passport.middleware');

var _passport2 = _interopRequireDefault(_passport);

var _graphql = require('./graphql.middleware');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function catchBlock(devMode, callback, errorCb) {
  try {
    return callback();
  } catch (error) {
    if (devMode) {
      throw error;
    }

    if (errorCb) {
      errorCb();
    }
    throw new Error(error.message);
  }
}

module.exports.passport = _passport2.default;
module.exports.devMiddleware = _dev2.default;
module.exports.html = _dev.html;
module.exports.authFields = _graphql.authFields;
module.exports.modifyResolver = _graphql.modifyResolver;
module.exports.setGlobalResolvers = _graphql.setGlobalResolvers;
module.exports.grantAccessAdmin = _graphql.grantAccessAdmin;
module.exports.grantAccessAdminOrOwner = _graphql.grantAccessAdminOrOwner;
module.exports.grantAccessUser = _graphql.grantAccessUser;
module.exports.grantAccessOwner = _graphql.grantAccessOwner;