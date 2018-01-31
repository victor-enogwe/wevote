import database from '../../models';
import { checkRole, checkOwnership, generateJwt } from './auth.controller';
import { handleSequelizeError } from '../../utils/error-handlers.utils';

const { User, Role } = database;
const allowedFields = [
  'firstname',
  'surname',
  'email',
  'phone',
  'age',
  'sex',
  'password'
];
/**
 * Create User
 *
 * @export
 * @param {any} data the user data
 *
 * @returns {object} the created User
 */
export async function createUser(data) {
  try {
    const role = await Role.findOne({ where: { name: 'USER' } });
    const permissions = await role.getPermissions();
    const user = await User.create(data, { fields: allowedFields });
    await user.setRoles(role);
    await user.setPermissions(permissions);

    const {
      firstname,
      phone,
      age,
      email
    } = await user;

    const userLite = await {
      firstname, phone, age, email
    };

    const token = await generateJwt(userLite);

    return token;
  } catch (error) {
    return error;
  }
}

/**
 * Creates a user
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @returns {object} the response
 */
export async function registerUser(req, res) {
  try {
    const user = await createUser(req.body);

    return res.status(201).json({ status: 'success', data: user });
  } catch (error) {
    return handleSequelizeError(error, res);
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
export async function updateUser(req, res) {
  try {
    const {
      role, user, decoded: { uuid: userUuid }, params: { uuid }
    } = req;
    const isOwner = checkOwnership(uuid, userUuid);
    const isSuperUser = checkRole(['ADMIN', 'SUPER_USER'], role);
    const canUpdate = isOwner || isSuperUser;

    if (!canUpdate) {
      throw new Error('un-authorized access');
    }

    if (isOwner) {
      await user.update(req.body, { fields: ['firstname', 'surname', 'age'] });
    } else if (isSuperUser) {
      await User
        .update(req.body, {
          where: { uuid },
          attributes: { exclude: ['id', 'createdAt', 'updatedAt'] }
        }, { fields: allowedFields });
    }
    return res.status(200).json({ status: 'success', message: 'User updated!' });
  } catch (error) {
    return res.status(500).json({ status: 'error', message: error.message });
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
export async function getUser(req, res) {
  try {
    const {
      role, user, decoded: { uuid: userUuid }, params: { uuid }
    } = req;
    const isOwner = checkOwnership(uuid, userUuid);
    const isSuperUser = checkRole(['ADMIN', 'SUPER_USER'], role);
    const canFetch = isOwner || isSuperUser;

    if (!canFetch) {
      throw new Error('un-authorized access');
    }

    const data = isOwner ? user : await User
      .findOne({
        where: { uuid: req.params.uuid },
        attributes: { exclude: ['id', 'password', 'createdAt', 'updatedAt'] }
      });

    if (data) {
      return res.status(200).json({ status: 'success', data });
    }

    return res.status(404).json({ status: 'fail', message: 'user not found' });
  } catch (error) {
    return handleSequelizeError(error, res);
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
export async function getUsers(req, res) {
  try {
    const { role } = req;
    const isSuperUser = checkRole(['ADMIN', 'SUPER_USER'], role);

    if (!isSuperUser) {
      throw new Error('un-authorized access');
    }

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
    return handleSequelizeError(error, res);
  }
}

/**
 * Reset a users password
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
export async function resetUserPassword(req, res) {}

/**
 * Update a users email
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
export async function updateUserEmail(req, res) {}

/**
 * Update a users phone
 *
 * @export
 * @param {object} req the request object
 * @param {object} res the response obbject
 *
 * @return {object} the response
 */
export async function updateUserPhone(req, res) {}
