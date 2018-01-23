import { Sequelize, Model } from 'sequelize';
/**
 * Permission Model
 *
 * @export
 * @class Permission
 * @extends {Model}
 */
export default class Permission extends Model {
  static modelFields = {
    access: {
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. There is an existing permission with this access.',
      },
      validate: {
        is: {
          args: /^([A-Z])*(_[A-Z]+)*/,
          msg: 'must use the underscore/uppercase naming convention'
        }
      },
      type: Sequelize.STRING
    }
  }

  /**
   * Initializes the Permission model
   *
   * @static
   * @memberof Permission
   *
   * @param {any} sequelize the sequelize object
   *
   * @returns {object} the Permission model
   */
  static init(sequelize) {
    return super.init(Permission.modelFields, { sequelize, version: true });
  }

  /**
   * Associations for the Permission model
   *
   * @static
   * @memberof Permission
   *
   * @param {any} models the Bchange api models
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { User, Role } = models;

    Permission.belongsToMany(User, {
      through: 'UserPermissions'
    });

    Permission.belongsToMany(Role, {
      through: 'RolePermissions'
    });
  }
}
