'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubsub = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlCompose = require('graphql-compose');

var _graphqlSubscriptions = require('graphql-subscriptions');

var _node = require('graphql-compose-mongoose/node8');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var pubsub = exports.pubsub = new _graphqlSubscriptions.PubSub();
var Schema = _mongoose2.default.Schema;
var notificationSchema = new Schema({
  title: {
    type: String,
    required: [true, 'title is required'],
    unique: true,
    validate: [{
      validator: function validator(value) {
        return value.length > 4 && value.length < 101;
      },
      message: 'title should be between 5 to 100 characters'
    }]
  },
  message: {
    type: String,
    required: [true, 'message is required'],
    validate: [{
      validator: function validator(value) {
        return value.length > 19 && value.length < 1001;
      },
      message: 'message should be between 20 to 1000 characters'
    }]
  }
}, { autoIndex: false, timestamps: true });

var model = _mongoose2.default.model('Notification', notificationSchema);
var modelTC = (0, _node.composeWithMongoose)(model);

_graphqlCompose.schemaComposer.rootQuery().addFields({
  NotificationConnection: modelTC.getResolver('connection'),
  NotificationPagination: modelTC.getResolver('pagination')
});

_graphqlCompose.schemaComposer.rootMutation().addFields({
  NotificationCreateOne: (0, _middlewares.modifyResolver)(Object.assign({}, modelTC.getResolver('createOne'), {
    resolve: function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(_ref) {
        var source = _ref.source,
            args = _ref.args,
            context = _ref.context,
            info = _ref.info;
        var result, record;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return modelTC.getResolver('createOne').resolve({ source: source, args: args, context: context, info: info });

              case 2:
                result = _context.sent;
                record = result.record;

                pubsub.publish('NewNotification', { NewNotification: record });

                return _context.abrupt('return', result);

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      function resolve(_x) {
        return _ref2.apply(this, arguments);
      }

      return resolve;
    }()
  }))
});
// modifyResolver(modelTC.getResolver('createOne'), admin)
_graphqlCompose.schemaComposer.rootSubscription().addFields({
  NewNotification: {
    kind: 'subscription',
    type: modelTC.getType(),
    subscribe: function subscribe() {
      return pubsub.asyncIterator('NewNotification');
    }
  }
});
var schema = _graphqlCompose.schemaComposer.buildSchema();

module.exports.modelTC = modelTC;
module.exports.model = model;
exports.default = { model: model, modelTC: modelTC, schema: schema };