'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlCompose = require('graphql-compose');

var _node = require('graphql-compose-mongoose/node8');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var roleSchema = new Schema({
  title: { type: String, required: true, unique: true }
}, { autoIndex: false });

var model = _mongoose2.default.model('Role', roleSchema);
var modelTC = (0, _node.composeWithMongoose)(model);

_graphqlCompose.schemaComposer.rootMutation().addFields({
  RoleCreateOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('createOne'), _middlewares.grantAccessAdmin),
  RoleUpdateOne: (0, _middlewares.modifyResolver)(modelTC.getResolver('updateOne'), _middlewares.grantAccessAdmin)
});

var schema = _graphqlCompose.schemaComposer.buildSchema();

module.exports.modelTC = modelTC;
module.exports.model = model;
exports.default = { model: model, modelTC: modelTC, schema: schema };