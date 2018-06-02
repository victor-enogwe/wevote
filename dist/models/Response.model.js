'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _node = require('graphql-compose-mongoose/node8');

var _graphqlCompose = require('graphql-compose');

var _createManyResolver = require('../models/create-many-resolver');

var _createManyResolver2 = _interopRequireDefault(_createManyResolver);

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var userSubResponseSchema = new Schema({
  question: {
    type: String,
    required: [true, 'sub-question question required']
  },
  answer: {
    type: String,
    required: [true, 'sub-question answer required']
  }
}, { _id: false, autoIndex: false });
var userResponseSchema = new Schema({
  creatorId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'creator id required']
  },
  questionId: {
    type: String,
    unique: true,
    required: [true, 'question id required']
  },
  answer: {
    type: String
  }
}, { autoIndex: false });

userResponseSchema.add({
  subResponses: {
    type: [userSubResponseSchema]
  }
});

var model = _mongoose2.default.model('Response', userResponseSchema);
var modelTC = (0, _node.composeWithMongoose)(model);
modelTC.setResolver('createMany', (0, _createManyResolver2.default)(model, modelTC));
(0, _middlewares.setGlobalResolvers)(model, modelTC, 'Response');

_graphqlCompose.schemaComposer.rootQuery().addFields({
  ResponseFindOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('findOne'), _middlewares.grantAccessAdminOrOwner),
  ResponseFindById: (0, _middlewares.modifyResolver)(modelTC.getResolver('findById'), _middlewares.grantAccessAdminOrOwner),
  ResponseFindByIds: (0, _middlewares.modifyResolver)(modelTC.getResolver('findByIds'), _middlewares.grantAccessAdmin),
  ResponseFindMany: (0, _middlewares.modifyResolver)(modelTC.getResolver('findMany'), _middlewares.grantAccessAdmin),
  ResponseCount: (0, _middlewares.modifyResolver)(modelTC.getResolver('count'), _middlewares.grantAccessAdmin),
  ResponseConnection: (0, _middlewares.modifyResolver)(modelTC.getResolver('connection'), _middlewares.grantAccessAdmin),
  ResponsePagination: (0, _middlewares.modifyResolver)(modelTC.getResolver('pagination'), _middlewares.grantAccessAdmin)
});

_graphqlCompose.schemaComposer.rootMutation().addFields({
  ResponseCreateOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('createOne'), _middlewares.grantAccessOwner),
  ResponseCreateMany: (0, _middlewares.modifyResolver)(modelTC.getResolver('createMany'), _middlewares.grantAccessOwner),
  ResponseUpdateOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('updateOne'), _middlewares.grantAccessOwner)
});

var schema = _graphqlCompose.schemaComposer.buildSchema();

module.exports.modelTC = modelTC;
module.exports.model = model;
exports.default = {
  model: model,
  modelTC: modelTC,
  schema: schema,
  addRelations: function addRelations(modelTCS) {
    modelTC.addRelation('creatorDetails', {
      description: 'the creator of this response',
      resolver: modelTCS.User.getResolver('findById'),
      prepareArgs: { _id: function _id(source) {
          return source.creatorId;
        } },
      projection: { creatorId: true }
    });
  }
};