'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.graphqlSchema = exports.database = undefined;

var _dotenv = require('dotenv');

var _dotenv2 = _interopRequireDefault(_dotenv);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _graphqlTools = require('graphql-tools');

var _findOrCreate = require('./find-or-create.plugin');

var _findOrCreate2 = _interopRequireDefault(_findOrCreate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.plugin(_findOrCreate2.default); // This file dynamically imports and creates graphql schemas out of models. model file must be named singular


var graphqlSchemas = [];
var modelTCS = {};
var relations = {};

_fs2.default.readdirSync(__dirname).filter(function (file) {
  return file.indexOf('.') !== 0 && !['find-or-create.plugin.js', 'create-many-resolver.js', 'index.js'].includes(file);
}).forEach(function (file) {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  var _require$default = require('./' + file).default,
      model = _require$default.model,
      schema = _require$default.schema,
      modelTC = _require$default.modelTC,
      _require$default$addR = _require$default.addRelations,
      addRelations = _require$default$addR === undefined ? null : _require$default$addR;

  var name = file.split('.')[0];
  module.exports[name] = model;
  modelTCS[name] = modelTC;
  if (addRelations) {
    relations[name] = addRelations;
  }
  graphqlSchemas.push(schema);
});

Object.keys(relations).map(function (name) {
  return relations[name](modelTCS);
});

_dotenv2.default.config();
_mongoose2.default.set('debug', process.env.NODE_ENV === 'development');
_mongoose2.default.Promise = Promise;
_mongoose2.default.connect(process.env.MONGODB_URI);

var database = exports.database = _mongoose2.default.connection;
module.exports.graphqlSchemas = graphqlSchemas;
var graphqlSchema = exports.graphqlSchema = (0, _graphqlTools.mergeSchemas)({
  schemas: graphqlSchemas
});