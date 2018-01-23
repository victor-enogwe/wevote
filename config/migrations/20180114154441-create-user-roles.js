import logger from 'winston';

export default {
  up(queryInterface, Sequelize) {
    return queryInterface.createTable('UserRoles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      UserId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true
      },
      RoleId: {
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
    return queryInterface.dropTable('UserRoles')
      .catch(error => logger.error(error));
  }
};
