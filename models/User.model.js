import bcrypt from 'bcrypt';
import { Sequelize, Model } from 'sequelize';
/**
 * User Model
 *
 * @export
 * @class User
 * @extends {Model}
 */
export default class User extends Model {
  static modelFields = {
    uuid: {
      type: Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: Sequelize.literal('uuid_generate_v4()'),
      noUpdate: true
    },
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z]{2,39}$/i,
          msg: 'firstname must start with a letter, have no spaces, and be 3 - \
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('firstname', value.trim());
      }
    },
    surname: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^[A-Za-z][A-Za-z]{2,39}$/i,
          msg: 'surname must start with a letter, have no spaces, and be 3 - \
40 characters long.'
        }
      },
      set(value) {
        this.setDataValue('surname', value.trim());
      }
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
      set(value) {
        this.setDataValue('state', value.trim());
      }
    },
    email: {
      allowNull: true,
      type: Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this email address.',
      },
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
      }
    },
    phone: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this phone number.',
      },
      validate: {
        is: {
          args: /0\d{10}/,
          msg: 'Please enter a valid phone number.'
        }
      },
    },
    sex: {
      type: Sequelize.ENUM,
      values: ['male', 'female'],
      allowNull: true,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
      validate: {
        is: {
          args: /\d+/,
          msg: 'please enter a valid date'
        }
      },
      set(value) {
        this.setDataValue('dob', value.trim());
      }
    },
    verified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
  };

  /**
   * initializes the User model
   *
   * @static
   * @memberof User
   *
   * @param {any} sequelize the sequelize obbject
   *
   * @returns {object} the User model
   */
  static init(sequelize) {
    return super.init(User.modelFields, { sequelize, version: true });
  }

  /**
   * the user model associations
   *
   * @static
   * @memberof User
   *
   * @param {any} models all models in the Bchange Api
   *
   * @returns {null} no return
   */
  static associate(models) {
    const {
      Permission,
      Role,
      SocialAccount,
      Vri
    } = models;

    User.belongsToMany(Permission, { through: 'UserPermissions' });
    User.belongsToMany(Role, { through: 'UserRoles' });
    User.hasMany(SocialAccount, { foreignKey: 'userUuid', sourceKey: 'uuid' });
    User.belongsToMany(Vri, { through: 'UserVris' });
  }

  /**
   * compares a string password with a hashed password
   *
   * @static
   * @memberof User
   *
   * @param {any} password the supplied password
   * @param {any} hashedPassword the hashed password
   *
   * @returns {boolean} the result of the password comparison
   */
  static comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
