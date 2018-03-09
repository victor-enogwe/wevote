import { Sequelize, Model } from 'sequelize';
/**
 * Vri Model
 *
 * @export
 * @class Vri
 * @extends {Model}
 */
export default class Notification extends Model {
  static modelFields = {
    code: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid choice code.'
        }
      },
      set(value) {
        this.setDataValue('code', value.trim());
      }
    },
    group: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid notification group.'
        }
      },
      set(value) {
        this.setDataValue('group', value.trim());
      }
    },
    message: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid message.'
        }
      },
      set(value) {
        this.setDataValue('message', value.trim());
      }
    }
  };

  /**
   * initializes the Vri model
   *
   * @static
   * @memberof Vri
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Vri model
   */
  static init(sequelize) {
    return super.init(Notification.modelFields, { sequelize, version: true });
  }

  /**
   * the Vri model associations
   *
   * @static
   * @memberof Vri
   *
   * @param {any} models all models in the Bchange Api
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { User } = models;

    Notification.belongsToMany(User, { through: 'UserNotifications' });
  }
}
