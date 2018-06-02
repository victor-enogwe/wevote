'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = findOrCreatePlugin;
function findOrCreatePlugin(schema, options) {
  schema.statics.findOrCreate = function findOrCreate(conditions, doc, options, callback) {
    var Self = this;
    // When using Mongoose 5.0.x and upper, we must use Self.base.Promise
    var Promise = Self.base.Promise.ES6 ? Self.base.Promise.ES6 : Self.base.Promise;
    if (arguments.length < 4) {
      if (typeof options === 'function') {
        // Scenario: findOrCreate(conditions, doc, callback)
        callback = options;
        options = {};
      } else if (typeof doc === 'function') {
        // Scenario: findOrCreate(conditions, callback);
        callback = doc;
        doc = {};
        options = {};
      } else {
        // Scenario: findOrCreate(conditions[, doc[, options]])
        return new Promise(function (resolve, reject) {
          Self.findOrCreate(conditions, doc, options, function (ex, result, created) {
            if (ex) {
              reject(ex);
            } else {
              resolve({
                doc: result,
                created: created
              });
            }
          });
        });
      }
    }
    this.findOne(conditions, function (err, result) {
      if (err || result) {
        if (options && options.upsert && !err) {
          Self.update(conditions, doc, function (err, count) {
            if (err) {
              callback(err, result, false);
            } else {
              Self.findById(result._id, function (err, result) {
                callback(err, result, false);
              });
            }
          });
        } else {
          callback(err, result, false);
        }
      } else {
        for (var key in doc) {
          conditions[key] = doc[key];
        }

        // If the value contain `$` remove the key value pair
        var keys = Object.keys(conditions);

        for (var z = 0; z < keys.length; z++) {
          var value = JSON.stringify(conditions[keys[z]]);
          if (value && value.indexOf('$') !== -1) {
            delete conditions[keys[z]];
          }
        }

        var obj = new Self(conditions);
        obj.save(function (err) {
          callback(err, obj, true);
        });
      }
    });
  };
}