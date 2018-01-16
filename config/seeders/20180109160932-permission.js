import logger from 'winston';

export default {
  up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = createdAt;
    return queryInterface.bulkInsert('Permissions', [
      { access: 'CREATE_USER', createdAt, updatedAt },
      { access: 'VIEW_USER', createdAt, updatedAt },
      { access: 'VIEW_USERS', createdAt, updatedAt },
      { access: 'MODIFY_USER', createdAt, updatedAt },
      { access: 'DELETE_USER', createdAt, updatedAt },
      { access: 'DELETE_USERS', createdAt, updatedAt }
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Permissions', null, {})
      .catch(error => logger.error(error));
  }
};
