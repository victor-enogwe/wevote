'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

exports.default = createMany;

var _graphql = require('graphql');

var _graphqlCompose = require('graphql-compose');

var _helpers = require('graphql-compose-mongoose/node8/resolvers/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function createMany(model, tc, opts) {
  var _this = this;

  if (!model || !model.modelName || !model.schema) {
    throw new Error('First arg for Resolver createMany() should be instance of Mongoose Model.');
  }
  if (!tc || tc.constructor.name !== 'TypeComposer') {
    throw new Error('Second arg for Resolver createMany() should be instance of TypeComposer.');
  }

  var outputTypeName = 'CreateMany' + tc.getTypeName() + 'Payload';
  var outputType = tc.constructor.schemaComposer.getOrCreateTC(outputTypeName, function (t) {
    t.addFields({
      message: {
        type: _graphql.GraphQLString,
        description: 'New records created message'
      }
    });
  });
  var resolver = new tc.constructor.schemaComposer.Resolver({
    name: 'createMany',
    kind: 'mutation',
    description: 'Create many documents without returning them: ' + 'Use Query.create mongoose method. ' + 'Do not apply mongoose defaults, setters, hooks and validation. ',
    type: outputType,
    args: {
      records: {
        type: [(0, _helpers.recordHelperArgs)(tc, Object.assign({
          recordTypeName: 'CreateMany' + tc.getTypeName() + 'Input',
          removeFields: ['id', '_id'],
          isRequired: true
        }, opts && opts.record)).record.type]
      }
    },
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(resolveParams) {
        var recordData, records;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                recordData = resolveParams.args && resolveParams.args.records || [];

                if (!(!Array.isArray(recordData) || recordData.length === 0)) {
                  _context.next = 3;
                  break;
                }

                return _context.abrupt('return', Promise.reject(new Error(tc.getTypeName() + '.createMany resolver requires ' + 'at least one response in args.record')));

              case 3:
                records = model.insertMany(recordData);
                return _context.abrupt('return', 'responses saved' || new Error(JSON.stringify(records)));

              case 5:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this);
      }));

      function resolve(_x) {
        return _ref.apply(this, arguments);
      }

      return resolve;
    }()
  });

  return resolver;
}