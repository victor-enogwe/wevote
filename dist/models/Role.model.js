'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _sequelize = require('sequelize');

/**
 * Role Model
 *
 * @export
 * @class Role
 * @extends {Model}
 */
class Role extends _sequelize.Model {

  /**
   * Initializes the Role model
   *
   * @static
   * @memberof Role
   *
   * @param {any} sequelize the sequelize object
   *
   * @returns {object} the Role model
   */
  static init(sequelize) {
    return super.init(Role.modelFields, { sequelize });
  }

  /**
   * Associations for the Role model
   *
   * @static
   * @memberof Role
   *
   * @param {any} models the LendMe api models
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { User, Permission } = models;

    Role.belongsToMany(User, {
      through: 'UserRoles'
    });

    Role.belongsToMany(Permission, {
      through: 'RolePermissions'
    });
  }
}
exports.default = Role;
Object.defineProperty(Role, 'modelFields', {
  enumerable: true,
  writable: true,
  value: {
    name: {
      type: _sequelize.Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing role with this name.'
      },
      validate: {
        is: {
          args: /^([A-Z])*(_[A-Z]+)*/,
          msg: 'name must use the underscore/uppercase naming convention'
        }
      }
    }
  }
});