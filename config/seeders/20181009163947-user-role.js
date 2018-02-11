import logger from 'winston';

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('UserRoles', [
      {
        UserId: 1,
        RoleId: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('UserRoles', null, {})
      .catch(error => logger.error(error));
  }
};
