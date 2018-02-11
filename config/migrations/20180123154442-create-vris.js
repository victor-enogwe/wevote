import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('Vris', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      code: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      choice: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      weight: {
        allowNull: false,
        type: Sequelize.TEXT
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
    return queryInterface.dropTable('Vris')
      .catch(error => logger.error(error));
  }
};
