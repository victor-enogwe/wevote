'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _circularJson = require('circular-json');

var _circularJson2 = _interopRequireDefault(_circularJson);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Redis Cacher class
 *
 * @export
 * @class Cacher
 */
class Cacher {

  /**
   * Creates an instance of Cacher.
   * @param {object} sequelize the sequelize class
   * @param {object} redis the redis class
   * @memberof Cacher
   */
  constructor(sequelize, redis) {
    Object.defineProperty(this, 'method', {
      enumerable: true,
      writable: true,
      value: 'find'
    });
    Object.defineProperty(this, 'options', {
      enumerable: true,
      writable: true,
      value: {}
    });
    Object.defineProperty(this, 'seconds', {
      enumerable: true,
      writable: true,
      value: 0
    });
    Object.defineProperty(this, 'cacheHit', {
      enumerable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, 'cachePrefix', {
      enumerable: true,
      writable: true,
      value: 'cacher'
    });

    this.sequelize = sequelize;
    this.redis = redis;
    Cacher.methods.forEach(Cacher.addMethod);
  }

  /**
   * Retrieves the redis model
   *
   * @param {String} modelName the sequelize model name
   *
   * @returns {Object} the redis model
   * @memberof Cacher
   */
  databaseModel(modelName) {
    this.model = this.sequelize.model(modelName);
    this.modelName = modelName;

    return this;
  }

  /**
   * Prefixes the cahe
   *
   * @param {String} cachePrefix the cache prefix
   *
   * @returns {Object} the redis cache
   * @memberof Cacher
   */
  prefix(cachePrefix) {
    this.cachePrefix = cachePrefix;

    return this;
  }

  /**
   * Runs the sequelize query
   *
   * @param {Object} options the redis options
   *
   * @returns {Promise} the returned query data
   * @memberof Cacher
   */
  run(options) {
    this.options = options || this.options;

    return this.fetchFromCache();
  }

  /**
   * Make Raw Queries in Database
   *
   * @param {String} key the redis key
   * @param {String} sqlQuery the sql query
   *
   * @returns {Promise} the data
   * @memberof Cacher
   */
  rawFromDatabase(key, sqlQuery) {
    return this.sequelize.query(sqlQuery, { type: this.sequelize.QueryTypes.SELECT }).then(results => {
      let res;
      if (!results) {
        res = results;
      } else if (Array.isArray(results)) {
        res = results;
      } else if (results.toString() === '[object SequelizeInstance]') {
        res = results.get({ plain: true });
      } else {
        res = results;
      }

      return res;
    }).then(res => this.setCache(key, res, this.seconds)).catch(error => error);
  }

  /**
   * JSON REPLACER
   *
   * @static
   * @param {String} key the database key
   * @param {Object} value the datavase value
   *
   * @returns {Object} a JSON object
   * @memberof Cacher
   */
  static jsonReplacer(key, value) {
    if (value && (value.DAO || value.sequelize)) {
      return value.name || '';
    }
    return value;
  }

  /**
   * Generate the database key
   *
   * @param {String} sqlQuery the sql query
   * @returns {String} the database key
   * @memberof Cacher
   */
  key(sqlQuery) {
    let hash = null;
    if (sqlQuery) {
      hash = _crypto2.default.createHash('sha1').update(sqlQuery).digest('hex');
      return [this.cachePrefix, '__raw__', 'query', hash].join(':');
    }
    hash = _crypto2.default.createHash('sha1').update(_circularJson2.default.stringify(this.options, Cacher.jsonReplacer)).digest('hex');
    return [this.cachePrefix, this.modelName, this.method, hash].join(':');
  }

  /**
   * Make Raw Queries in Redis
   *
   * @param {String} sqlQuery the sql query
   *
   * @returns {Promise} the data
   * @memberof Cacher
   */
  rawFromCache(sqlQuery) {
    return new _bluebird2.default((resolve, reject) => {
      const key = this.key(sqlQuery);
      return this.redis.get(key, (err, res) => {
        if (err) {
          return reject(err);
        }
        if (!res) {
          return this.rawFromDatabase(key, sqlQuery).then(resolve, reject);
        }
        this.cacheHit = true;
        try {
          return resolve(JSON.parse(res));
        } catch (e) {
          return reject(e);
        }
      });
    });
  }

  /**
   * Fetch from Database
   *
   * @param {String} key the database key
   *
   * @returns {Object} the data
   * @memberof Cacher
   */
  fetchFromDatabase(key) {
    const method = this.model[this.method];
    this.cacheHit = false;
    if (!method) {
      throw new Error(`Invalid method - ${this.method}`);
    }

    return method.call(this.model, this.options).then(results => {
      let res;
      if (!results) {
        res = results;
      } else if (Array.isArray(results)) {
        res = results;
      } else if (results.toString() === '[object SequelizeInstance]') {
        res = results.get({ plain: true });
      } else {
        res = results;
      }

      return res;
    }).then(res => this.setCache(key, res, this.seconds)).catch(error => error);
  }

  /**
   * Runs a manual query
   *
   * @param {String} sqlQuery the sql query
   *
   * @returns {Object} the raw query data
   * @memberof Cacher
   */
  query(sqlQuery) {
    return this.rawFromCache(sqlQuery);
  }

  /**
   * Set redis TTL (in seconds)
   *
   * @param {Number} seconds the time in seconds
   *
   * @returns {Object} the redis cache
   * @memberof Cacher
   */
  ttl(seconds) {
    this.seconds = seconds;

    return this;
  }

  /**
   * Set Data in Cache
   *
   * @param {String} key the database key
   * @param {Object} results the data
   * @param {Numer} ttl time to live for cache
   *
   * @returns {Promise} the cache
   * @memberof Cacher
   */
  setCache(key, results, ttl) {
    const args = [];
    let res;

    try {
      res = JSON.stringify(results);
    } catch (error) {
      throw error;
    }

    args.push(key, res);

    if (ttl) {
      args.push('EX', ttl);
    }

    return this.redis.set(args, (error, res) => {
      if (error) {
        throw error;
      }

      return res;
    });
  }

  /**
   * Clear the Redis Cache
   *
   * @param {Object} options the redis options
   * @returns {Promise} the redis cache
   * @memberof Cacher
   */
  clearCache(options) {
    this.options = options || this.options;
    const key = this.key();
    return this.redis.del(key, error => {
      if (error) {
        throw error;
      }
    });
  }

  /**
   * Fetch Data from Cache
   *
   * @returns {Object} the data
   * @memberof Cacher
   */
  fetchFromCache() {
    const key = this.key();
    return this.redis.get(key, async (error, res) => {
      if (error) {
        throw error;
      }
      try {
        if (!res) {
          // check for error @TODO
          res = await this.fetchFromDatabase(key);
        }
        this.cacheHit = true;
        return JSON.parse(res);
      } catch (err) {
        throw err;
      }
    });
  }

  /**
   * Add methods
   *
   * @param {String} key the method key
   *
   * @returns {null} no return
   * @memberof Cacher
   */
  static addMethod(key) {
    Cacher.prototype[key] = (...args) => {
      if (!this.md) {
        return _bluebird2.default.reject(new Error('Model not set'));
      }
      this.method = key;
      return this.run([...args]);
    };
  }
}
exports.default = Cacher;
Object.defineProperty(Cacher, 'methods', {
  enumerable: true,
  writable: true,
  value: ['find', 'findOne', 'findAll', 'findAndCount', 'findAndCountAll', 'all', 'min', 'max', 'sum', 'count']
});