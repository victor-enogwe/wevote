import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize
      .query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .then(() => queryInterface.createTable('Users', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        uuid: {
          type: Sequelize.UUID,
          allowNull: false,
          unique: true,
          defaultValue: Sequelize.literal('uuid_generate_v4()')
        },
        firstname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        surname: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        state: {
          type: Sequelize.STRING,
          allowNull: false
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
          isEmail: true,
          unique: true
        },
        sex: {
          type: Sequelize.ENUM,
          values: ['male', 'female'],
          allowNull: true,
        },
        dob: {
          type: Sequelize.DATE,
          allowNull: true
        },
        verified: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false
        },
        type: {
          type: Sequelize.ENUM,
          values: ['ussd', 'web'],
          allowNull: false,
          defaultValue: 'web'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        version: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true
        }
      }))
      .catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('Users')
      .catch(error => logger.error(error));
  }
};
