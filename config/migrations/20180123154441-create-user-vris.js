import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('UserVris', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      completed: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false
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
    }).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.dropTable('UserVris')
      .catch(error => logger.error(error));
  }
};
