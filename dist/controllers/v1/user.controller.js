'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getUser = getUser;
exports.getUsers = getUsers;

var _models = require('../../models');

var _models2 = _interopRequireDefault(_models);

var _errorHandlers = require('../../utils/error-handlers.utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { User, Role } = _models2.default;
const allowedFields = ['firstname', 'surname', 'email', 'phone', 'password'];

/**
 * Creates a user
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
async function createUser(req, res) {
  try {
    const role = await Role.findOne({ where: { name: 'USER' } });
    const permissions = await role.getPermissions();
    const user = await User.create(req.body, { fields: allowedFields });

    await user.setRoles(role);
    await user.setPermissions(permissions);

    return res.status(201).json({ status: 'success' });
  } catch (error) {
    return (0, _errorHandlers.handleSequelizeError)(error, res);
  }
}

/**
 * Update a user's info
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
async function updateUser(req, res) {
  try {
    const update = await User.update(req.body, {
      where: { uuid: req.params.uuid || req.decoded.uuid },
      attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
    }, { fields: allowedFields });

    if (update[0] === 1) {
      return res.status(200).json({ status: 'success' });
    }

    return res.status(404).json({ status: 'fail', message: 'user not found' });
  } catch (error) {
    return (0, _errorHandlers.handleSequelizeError)(error, res);
  }
}

/**
 * Get a user's info
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
async function getUser(req, res) {
  try {
    const { uuid } = req.user;
    const currentUser = uuid === req.decoded.uuid || uuid === req.params.uuid;
    const data = currentUser ? req.user : await User.findOne({
      where: { uuid: req.params.uuid },
      attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
    });

    if (data) {
      return res.status(200).json({ status: 'success', data });
    }

    return res.status(404).json({ status: 'fail', message: 'user not found' });
  } catch (error) {
    return (0, _errorHandlers.handleSequelizeError)(error, res);
  }
}

/**
 * Get a user's info
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
async function getUsers(req, res) {
  try {
    const limit = req.query.limit || 10;
    const offset = req.query.offset || 0;
    const data = await User.findAndCount({
      limit,
      offset,
      attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
    });

    if (data.rows.length > 0) {
      const pages = +(data.count / limit).toFixed();
      data.totalPages = pages === 0 ? 1 : pages;
      data.currentPage = (offset === 0 ? 1 : offset / limit).toFixed();
      return res.status(200).json({ status: 'success', data });
    }

    return res.status(404).json({ status: 'fail', message: 'no user found' });
  } catch (error) {
    return (0, _errorHandlers.handleSequelizeError)(error, res);
  }
}