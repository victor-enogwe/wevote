'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redisDatabase = undefined;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _redis = require('redis');

var _sequelize = require('sequelize');

var _redisSequelize = require('../config/redis-sequelize');

var _redisSequelize2 = _interopRequireDefault(_redisSequelize);

var _sequelize2 = require('../config/sequelize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log(_sequelize2.SequelizeNoUpdateAttributes, _sequelize2.config, true);
const redisClient = (0, _redis.createClient)(6379, 'localhost');
const sequelize = new _sequelize.Sequelize(_sequelize2.config.url, _sequelize2.config);
const redisDatabase = exports.redisDatabase = new _redisSequelize2.default(sequelize, redisClient);
const database = {};

(0, _sequelize2.SequelizeNoUpdateAttributes)(sequelize);

_fs2.default.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file !== 'index.js').forEach(file => {
  /* eslint-disable import/no-dynamic-require */
  /* eslint-disable global-require */
  const model = require(`./${file}`).default.init(sequelize);
  database[model.name] = model;
});

Object.keys(database).forEach(model => {
  if (database[model].associate) {
    database[model].associate(database);
  }
});

database.sequelize = sequelize;
database.Sequelize = _sequelize.Sequelize;

exports.default = database;