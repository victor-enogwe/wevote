import { Sequelize, Model } from 'sequelize';
/**
 * Vri Model
 *
 * @export
 * @class Vri
 * @extends {Model}
 */
export default class Vri extends Model {
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
    question: {
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
    choice: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid title.'
        }
      },
      set(value) {
        this.setDataValue('choice', value.trim());
      }
    },
    response: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid response.'
        }
      },
      set(value) {
        this.setDataValue('response', value.trim());
      }
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        is: {
          args: /\d+/,
          msg: 'please enter a valid number'
        }
      },
      set(value) {
        this.setDataValue('weight', value.trim());
      }
    },
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
    return super.init(Vri.modelFields, { sequelize, version: true });
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

    Vri.belongsToMany(User, { through: 'UserVris' });
  }
}
