'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.modifyResolver = modifyResolver;
exports.setGlobalResolvers = setGlobalResolvers;
exports.grantAccessAdmin = grantAccessAdmin;
exports.grantAccessAdminOrOwner = grantAccessAdminOrOwner;
exports.grantAccessUser = grantAccessUser;
exports.grantAccessOwner = grantAccessOwner;

var _graphql = require('graphql');

var _models = require('../models');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function modifyResolver(resolver, callback) {
  return Object.assign({}, resolver, {
    resolve: function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        for (var _len = arguments.length, resolveParams = Array(_len), _key = 0; _key < _len; _key++) {
          resolveParams[_key] = arguments[_key];
        }

        var _resolveParams, source, args, context, info, _ref2, title, result;

        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _resolveParams = _slicedToArray(resolveParams, 4), source = _resolveParams[0], args = _resolveParams[1], context = _resolveParams[2], info = _resolveParams[3];

                if (!context.user._id) {
                  _context.next = 8;
                  break;
                }

                _context.next = 4;
                return _models.User.findById(context.user._id).populate('roleId');

              case 4:
                _ref2 = _context.sent;
                title = _ref2.roleId.title;

                context.user.roleDetails = { title: title };

                if (info.fieldName === 'UserFindById' && args._id === 'current') {
                  args._id = context.user._id;
                }

              case 8:
                if (!(callback && typeof callback === 'function')) {
                  _context.next = 10;
                  break;
                }

                return _context.abrupt('return', callback(args, info.fieldName, resolver.resolve.bind(null, { source: source, args: args, context: context, info: info }), context));

              case 10:
                _context.next = 12;
                return resolver.resolve({ source: source, args: args, context: context, info: info });

              case 12:
                result = _context.sent;
                return _context.abrupt('return', result);

              case 14:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function resolve() {
        return _ref.apply(this, arguments);
      }

      return resolve;
    }()
  });
}

function setGlobalResolvers(model, modelTC, modelName) {
  var findOrCreateArgs = modelTC.getResolver('createOne').getArgs();
  var findManyResolver = function findManyResolver(modelTC, resolver) {
    return modelTC.getResolver(resolver).addFilterArg({
      name: 'search',
      type: 'String',
      description: 'Search ' + modelName + ' contents',
      query: function query(rawQuery, value, resolveParams) {
        return rawQuery['$or'] = ['title', 'displayName', 'city', 'address', 'state'].map(function (field) {
          return _defineProperty({}, field, new RegExp(value.split(' ').join('|'), 'i'));
        });
      }
    }).wrapResolve(function (next) {
      return function (rp) {
        return next(rp);
      };
    });
  };

  modelTC.addResolver({
    name: 'findOrCreateOne',
    kind: 'mutation',
    type: modelTC.getResolver('createOne').getType(),
    args: Object.assign({
      query: { type: findOrCreateArgs.record.type } }, findOrCreateArgs),
    resolve: function () {
      var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref4) {
        var source = _ref4.source,
            args = _ref4.args,
            context = _ref4.context,
            info = _ref4.info;

        var _ref6, record;

        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return model.findOrCreate(args.query, args.record, { new: true });

              case 2:
                _ref6 = _context2.sent;
                record = _ref6.doc;
                return _context2.abrupt('return', { record: record, recordId: modelTC.getRecordIdFn()(record) });

              case 5:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function resolve(_x) {
        return _ref5.apply(this, arguments);
      }

      return resolve;
    }()
  });

  modelTC.setResolver('findMany', findManyResolver(modelTC, 'findMany'));
  modelTC.setResolver('pagination', findManyResolver(modelTC, 'pagination'));
  modelTC.setResolver('connection', modelTC.getResolver('connection').addSortArg({ name: 'DATE_ASC', value: { createdAt: 1 } }).addSortArg({ name: 'DATE_DESC', value: { createdAt: -1 } }));
  modelTC.setResolver('pagination', modelTC.getResolver('pagination').addSortArg({ name: 'DATE_ASC', value: { createdAt: 1 } }).addSortArg({ name: 'DATE_DESC', value: { createdAt: -1 } }));
}

function grantAccessAdmin() {
  for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    args[_key2] = arguments[_key2];
  }

  var _args$slice = args.slice(1),
      _args$slice2 = _slicedToArray(_args$slice, 3),
      name = _args$slice2[0],
      resolver = _args$slice2[1],
      context = _args$slice2[2];

  var user = context.user;

  var _name$match = name.match(/[A-Z][a-z]+/g),
      _name$match2 = _slicedToArray(_name$match, 2),
      field = _name$match2[0],
      operation = _name$match2[1];

  if (!user.roleDetails || user.roleDetails.title !== 'ADMIN') {
    throw new _graphql.GraphQLError('you  dont have permission to ' + operation.toLowerCase() + ' ' + field.toLowerCase());
  }

  return resolver();
}

function grantAccessAdminOrOwner() {
  for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    args[_key3] = arguments[_key3];
  }

  var arg = args[0],
      name = args[1],
      resolver = args[2],
      context = args[3];
  var user = context.user;

  var _name$match3 = name.match(/[A-Z][a-z]+/g),
      _name$match4 = _slicedToArray(_name$match3, 2),
      field = _name$match4[0],
      operation = _name$match4[1];

  if (!user.roleDetails) {
    throw new _graphql.GraphQLError('you  dont have permission to ' + operation.toLowerCase() + ' ' + field.toLowerCase());
  }

  var admin = user.roleDetails.title === 'ADMIN';
  var owner = (arg._id || arg.record._id || arg.record.creatorId) === user._id;
  if (!(admin || owner)) {
    throw new _graphql.GraphQLError('you  dont have permission to ' + operation.toLowerCase() + ' ' + field.toLowerCase());
  }

  return resolver();
}

function grantAccessUser() {
  for (var _len4 = arguments.length, args = Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    args[_key4] = arguments[_key4];
  }

  var _args$slice3 = args.slice(1),
      _args$slice4 = _slicedToArray(_args$slice3, 3),
      name = _args$slice4[0],
      resolver = _args$slice4[1],
      context = _args$slice4[2];

  var user = context.user;

  var _name$match5 = name.match(/[A-Z][a-z]+/g),
      _name$match6 = _slicedToArray(_name$match5, 2),
      field = _name$match6[0],
      operation = _name$match6[1];

  if (!user.roleDetails) {
    throw new _graphql.GraphQLError('you  dont have permission to ' + operation.toLowerCase() + ' ' + field.toLowerCase());
  }

  return resolver();
}

function grantAccessOwner() {
  for (var _len5 = arguments.length, args = Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
    args[_key5] = arguments[_key5];
  }

  var arg = args[0],
      name = args[1],
      resolver = args[2],
      context = args[3];
  var user = context.user;

  var _name$match7 = name.match(/[A-Z][a-z]+/g),
      _name$match8 = _slicedToArray(_name$match7, 2),
      field = _name$match8[0],
      operation = _name$match8[1];

  var owner = (arg.id || (arg.record ? arg.record._id || arg.record.creatorId : undefined)) === user._id;

  if (arg.records && arg.records[0].creatorId) {
    owner = arg.records.every(function (record) {
      return record.creatorId === user._id;
    });
  }

  if (!owner && user.roleDetails) {
    throw new _graphql.GraphQLError('you  dont have permission to ' + operation.toLowerCase() + ' ' + field.toLowerCase());
  }

  return resolver();
}