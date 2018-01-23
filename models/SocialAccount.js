import { Sequelize, Model } from 'sequelize';

/**
 * Social Accounts Model
 *
 * @export
 * @class SocialAccount
 * @extends {Model} the
 */
export default class SocialAccount extends Model {
  static modelFields = {
    userUuid: {
      type: Sequelize.UUID,
      allowNull: false,
      validate: {
        isUUID: 4
      },
      noUpdate: true
    },
    socialId: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        is: {
          args: /\w+/,
          msg: 'Invalid social Id.'
        }
      },
      noUpdate: true,
      set(value) {
        this.setDataValue('socialId', value.trim());
      }
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
      validate: {
        isEmail: {
          args: true,
          msg: 'The email you entered is invalid.'
        },
        isTooLong(value) {
          if (value.length > 254) {
            throw new Error('The email you entered is invalid  and longer \
than 254 characters.');
          }
        }
      },
      set(value) {
        this.setDataValue('email', value);
      },
      noUpdate: true
    },
    provider: {
      type: Sequelize.ENUM,
      allowNull: false,
      noUpdate: true,
      values: ['twitter', 'facebook'],
    },
  };

  /**
   * initializes the Social Account model
   *
   * @static
   * @memberof SocialAccount
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the Social Account model
   */
  static init(sequelize) {
    return super.init(SocialAccount.modelFields, { sequelize, version: true });
  }

  /**
   * the Social Account model associations
   *
   * @static
   * @memberof SocialAccount
   *
   * @param {any} models all models in the We vote Api
   *
   * @returns {null} no return
   */
  static associate(models) {
    const { User } = models;

    SocialAccount.belongsTo(User, { foreignKey: 'userUuid', targetKey: 'uuid' });
  }
}
