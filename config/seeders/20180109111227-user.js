import logger from 'winston';


export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        firstname: process.env.ADMIN_FIRSTNAME,
        surname: process.env.ADMIN_SURNAME,
        email: process.env.ADMIN_EMAIL,
        phone: process.env.ADMIN_PHONE_NUMBER,
        dob: new Date(),
        state: 'Lagos',
        sex: 'male',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('User', null, {})
      .catch(error => logger.error(error));
  }
};
