import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('UserPermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      PermissionId: {
        allowNull: false,
        type: Sequelize.INTEGER
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
    return queryInterface.dropTable('UserPermissions')
      .catch(error => logger.error(error));
  }
};
