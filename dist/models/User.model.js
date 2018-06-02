'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _graphqlCompose = require('graphql-compose');

var _node = require('graphql-compose-mongoose/node8');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var addressSchema = new Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String }
}, { autoIndex: false });
var userSchema = new Schema({
  socialId: {
    type: String,
    required: true,
    unique: true,
    match: /\d+/
  },
  displayName: {
    type: String,
    required: [true, 'displayName is required'],
    match: /^([A-Za-z]+((\s[A-Za-z]+)+)?)$/
  },
  emails: [{ value: {
      type: String,
      required: true,
      unique: true,
      validate: [{
        validator: function validator(value) {
          return (0, _validator.isEmail)(value);
        },
        message: 'email is invalid.'
      }]
    } }],
  photos: [{ value: { type: String, validate: { validator: _validator.isURL } } }],
  address: addressSchema,
  phone: {
    type: String,
    validate: [{
      validator: function validator(value) {
        return (0, _validator.isMobilePhone)(value, undefined.address.country);
      },
      message: 'phone is invalid.'
    }]
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role'
  },
  vriTaken: {
    type: Boolean,
    default: false
  }
}, { autoIndex: false });

var model = _mongoose2.default.model('User', userSchema);
var modelTC = (0, _node.composeWithMongoose)(model, {
  resolvers: {
    updateById: {
      record: {
        removeFields: ['socialId', 'roleId']
      }
    }
  }
});

(0, _middlewares.setGlobalResolvers)(model, modelTC, 'User');
_graphqlCompose.schemaComposer.rootQuery().addFields({
  UserFindOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('findOne'), _middlewares.grantAccessAdmin),
  UserFindById: (0, _middlewares.modifyResolver)(modelTC.getResolver('findById'), _middlewares.grantAccessAdminOrOwner),
  UserFindByIds: (0, _middlewares.modifyResolver)(modelTC.getResolver('findByIds'), _middlewares.grantAccessAdmin),
  UserFindMany: (0, _middlewares.modifyResolver)(modelTC.getResolver('findMany'), _middlewares.grantAccessAdmin),
  UserCount: (0, _middlewares.modifyResolver)(modelTC.getResolver('count'), _middlewares.grantAccessAdmin),
  UserConnection: (0, _middlewares.modifyResolver)(modelTC.getResolver('connection'), _middlewares.grantAccessAdmin),
  UserPagination: (0, _middlewares.modifyResolver)(modelTC.getResolver('pagination'), _middlewares.grantAccessAdmin)
});

_graphqlCompose.schemaComposer.rootMutation().addFields({
  UserUpdateById: (0, _middlewares.modifyResolver)(modelTC.getResolver('updateById'), _middlewares.grantAccessAdminOrOwner),
  UserRemoveById: (0, _middlewares.modifyResolver)(modelTC.getResolver('removeById'), _middlewares.grantAccessAdminOrOwner)
});

var schema = _graphqlCompose.schemaComposer.buildSchema();

module.exports.modelTC = modelTC;
module.exports.model = model;
exports.default = {
  model: model,
  modelTC: modelTC,
  schema: schema,
  addRelations: function addRelations(modelTCS) {
    modelTC.addRelation('responseMap', {
      description: 'the user response map',
      resolver: modelTCS.Response.getResolver('findMany'),
      args: {
        filter: function filter(source) {
          return { creatorId: source._id };
        },
        limit: function limit(source, args) {
          return args.limit;
        }
      },
      projection: { _id: true }
    });

    modelTC.addRelation('roleDetails', {
      description: 'the user role',
      resolver: modelTCS.Role.getResolver('findById'),
      prepareArgs: { _id: function _id(source) {
          return source.roleId;
        } },
      projection: { roleId: true }
    });
  }
};