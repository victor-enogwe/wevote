import logger from 'winston';

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Vris', [
      {
        code: 'A',
        choice: "I have collected my Voter's Card",
        weight: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'B',
        choice: 'I have registered and I know where to collect my card',
        weight: 37.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'C',
        choice: 'I have registered but I don\'t know where to collect my card',
        weight: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'D',
        choice: 'I have not registered but I know where to register',
        weight: 12.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'E',
        choice: 'I don\'t know where to register for my card',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'F',
        choice: 'I registered within my city of residence',
        weight: 10,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'G',
        choice: 'I registered within my state of residence but not in my city of residence',
        weight: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'H',
        choice: 'I registered outside my state of residence',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'I',
        choice: 'I have decided the candidates to vote for',
        weight: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'J',
        choice: 'I don\'t know any candidate I can vote for',
        weight: 15,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Vris', null, {})
      .catch(error => logger.error(error));
  }
};
