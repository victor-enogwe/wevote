'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _sequelize = require('sequelize');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * User Model
 *
 * @export
 * @class User
 * @extends {Model}
 */
class User extends _sequelize.Model {
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
    return super.init(User.modelFields, { sequelize });
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
    // add associations
    return models;
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
    return _bcrypt2.default.compareSync(password, hashedPassword);
  }
}
exports.default = User;
Object.defineProperty(User, 'modelFields', {
  enumerable: true,
  writable: true,
  value: {
    uuid: {
      type: _sequelize.Sequelize.UUID,
      unique: true,
      allowNull: false,
      defaultValue: _sequelize.Sequelize.literal('uuid_generate_v4()'),
      noUpdate: true
    },
    firstname: {
      type: _sequelize.Sequelize.STRING,
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
      type: _sequelize.Sequelize.STRING,
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
    email: {
      allowNull: false,
      type: _sequelize.Sequelize.STRING,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this email address.'
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
      type: _sequelize.Sequelize.STRING,
      allowNull: true,
      unique: {
        args: true,
        msg: 'Oops. There is an existing account with this phone number.'
      },
      validate: {
        is: {
          args: /0\d{10}/,
          msg: 'Please enter a valid phone number.'
        }
      },
      set(value) {
        this.setDataValue('phone', value.trim());
      }
    },
    password: {
      type: _sequelize.Sequelize.STRING,
      allowNull: false,
      validate: {
        isLongEnough(value) {
          if (value.length < 8) {
            throw new Error('Please choose a longer password');
          }
          const salt = _bcrypt2.default.genSaltSync(10);
          const hash = _bcrypt2.default.hashSync(value, salt);
          this.setDataValue('password', hash);
        }
      }
    }
  }
});