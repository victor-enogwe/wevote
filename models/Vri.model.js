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
    question: {
      type: Sequelize.TEXT,
      allowNull: false,
      validate: {
        is: {
          args: /\w+/ig,
          msg: 'please enter a valid title.'
        }
      },
      set(value) {
        this.setDataValue('question', value.trim());
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
