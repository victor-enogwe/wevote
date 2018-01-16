import logger from 'winston';
import database from '../../models';

export default {
  async up(queryInterface) {
    const roles = await database.Role
      .findAll({ attributes: ['id', 'name'] })
      .map(data => data.dataValues);

    const permissions = await database.Permission
      .findAll({ attributes: ['id', 'access'] })
      .map(data => data.dataValues);

    const getRoleByName = roleName => roles
      .filter(role => role.name === roleName)[0];

    const allowedAdminPermissions = [
      'CREATE_USER',
      'VIEW_USER',
      'VIEW_USERS',
      'MODIFY_USER',
      'DELETE_USER',
      'DELETE_USERS'
    ];

    const allowedUserPermissions = [
      'VIEW_USER',
      'MODIFY_USER'
    ];

    const getPermissions = (allowedPermissions, roleName) => permissions
      .filter(permission => allowedPermissions.includes(permission.access))
      .map(permission => ({
        RoleId: getRoleByName(roleName).id,
        PermissionId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

    const adminPermissions = getPermissions(allowedAdminPermissions, 'ADMIN');

    const userPermissions =
     getPermissions(allowedUserPermissions, 'USER');

    return queryInterface.bulkInsert('RolePermissions', [
      ...adminPermissions,
      ...userPermissions
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Role', null, {})
      .catch(error => logger.error(error));
  }
};
