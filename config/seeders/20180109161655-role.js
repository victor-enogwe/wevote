import logger from 'winston';

export default {
  up(queryInterface) {
    const createdAt = new Date();
    const updatedAt = createdAt;
    return queryInterface.bulkInsert('Roles', [
      { name: 'SUPER_USER', createdAt, updatedAt },
      { name: 'ADMIN', createdAt, updatedAt },
      { name: 'USER', createdAt, updatedAt }
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Role', null, {})
      .catch(error => logger.error(error));
  }
};
