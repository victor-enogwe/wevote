import { Sequelize, Model } from 'sequelize';
/**
 * Role Model
 *
 * @export
 * @class Role
 * @extends {Model}
 */
export default class Role extends Model {
  static modelFields = {
    name: {
      type: Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing role with this name.',
      },
      validate: {
        is: {
          args: /^([A-Z])*(_[A-Z]+)*/,
          msg: 'name must use the underscore/uppercase naming convention'
        }
      }
    }
  };

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
    return super.init(Role.modelFields, { sequelize, version: true });
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
