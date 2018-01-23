import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('RolePermissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      RoleId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      PermissionId: {
        type: Sequelize.INTEGER,
        allowNull: false
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
    return queryInterface.dropTable('RolePermissions')
      .catch(error => logger.error(error));
  }
};
