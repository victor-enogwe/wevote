import logger from 'winston';
import bcrypt from 'bcrypt';

const encryptPassword = password => bcrypt
  .hashSync(password, bcrypt.genSaltSync(10));

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Users', [
      {
        firstname: process.env.ADMIN_FIRSTNAME,
        surname: process.env.ADMIN_SURNAME,
        email: process.env.ADMIN_EMAIL,
        phone: process.env.ADMIN_PHONE_NUMBER,
        password: encryptPassword(process.env.ADMIN_PASSWORD),
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
