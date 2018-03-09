import { Sequelize, Model } from 'sequelize';
/**
 * UserNotification Model
 *
 * @export
 * @class UserNotification
 * @extends {Model}
 */
export default class UserNotification extends Model {
  static modelFields = {
    UserId: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid question.'
        }
      },
      set(value) {
        this.setDataValue('question', value.trim());
      }
    },
    NotificationId: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    read: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  };

  /**
   * initializes the UserNotification model
   *
   * @static
   * @memberof UserNotification
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the UserNotification model
   */
  static init(sequelize) {
    return super.init(UserNotification.modelFields, { sequelize, version: true });
  }
}
