import logger from 'winston';

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Vris', [
      {
        code: 'Q1',
        question: 'Start',
        choice: 'A',
        response: 'Continue',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q1',
        question: 'Start',
        choice: 'B',
        response: 'I have taken the VRI test',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q2',
        question: 'Which Voters Card do you have?',
        choice: 'A',
        response: 'PVC',
        weight: 75,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q2',
        question: 'Which Voters Card do you have?',
        choice: 'B',
        response: 'TVC',
        weight: 37.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q2',
        question: 'Which Voters Card do you have?',
        choice: 'C',
        response: 'None',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q2',
        question: 'Which Voters Card do you have?',
        choice: 'D',
        response: 'PCV got lost',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q3',
        question: 'How close is your registration center to your residence?',
        choice: 'A',
        response: 'Within my city',
        weight: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q3',
        question: 'How close is your registration center to your residence?',
        choice: 'B',
        response: 'Outside my city',
        weight: 12.5,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q4',
        question: 'When did you register?',
        choice: 'A',
        response: '2017-2018',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q4',
        question: 'When did you register?',
        choice: 'B',
        response: '2013-2014',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q4',
        question: 'When did you register?',
        choice: 'C',
        response: '2009-2010',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q4',
        question: 'When did you register?',
        choice: 'D',
        response: 'Before 2007',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q5',
        question: 'Have you registered as a voter?',
        choice: 'A',
        response: 'Yes',
        weight: 35,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'Q5',
        question: 'Have you registered as a voter?',
        choice: 'B',
        response: 'No',
        weight: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Vris', null, {})
      .catch(error => logger.error(error));
  }
};
