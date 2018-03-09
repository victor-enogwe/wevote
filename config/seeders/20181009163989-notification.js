import logger from 'winston';

export default {
  up(queryInterface) {
    return queryInterface.bulkInsert('Notifications', [
      {
        code: 'A1',
        group: '1',
        message: 'Congratulations! You have your Permanent Voters Card so you can vote. ' +
        'Please ensure you cast your vote aright!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'A2',
        group: '1',
        message: 'Your PVC is your licence to a better Nigeria. Never let anything ' +
        'stop you from voting for your candidate of choice.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'A3',
        group: '1',
        message: 'Politics is not a dirty game but a game of numbers, if the dirty people ' +
        'have the number, they have the game!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'B1',
        group: '2',
        message: 'You need to have your Permanent Voters card at hand in order to vote.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'B2',
        group: '2',
        message: 'Do you know that getting your PVC is not as hard as you think? You can see the ' +
        'steps when you check your Vote-Readiness at http://wevote-ng.herokuapp.com/',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'C1',
        group: '3',
        message: 'Great! You have a temporary voters card but you need to collect ' +
        'your Permanent Voters',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'C2',
        group: '3',
        message: 'Your temporary voters card will not give Nigeria the permanent change she needs; ' +
        'go for your Permanent Voters Card!',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'D1',
        group: '4',
        message: "Not having a voter's card means you will not be able to vote in this coming " +
        'election. Hurry and get your PVC before the closing death',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'E1',
        group: '5',
        message: 'Do you know it is possible to get another voters card if you lost your own? ' +
        'Visit a registration center near you or the INEC office in your Local Government.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'F1',
        group: '6',
        message: "It's a good thing you registered within your city so you can easily " +
        'come out to vote.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'G1',
        group: '7',
        message: "Since you didn't register within your city, it would be very difficult for you to vote" +
        'because there will be restriction of movement on the election days. However, you can transfer your' +
        'registration to a center near you. Visit a registration center or an INEC office.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'H1',
        group: '8',
        message: 'Visit the center where you registered to collect your Permanent Voters Card.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'H2',
        group: '8',
        message: 'You should pick up your Temporary Voters card from the center you registered ' +
        "and get your Permanent Voters Card when it's ready.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'I1',
        group: '9',
        message: 'Visit a registration center to begin a new registration.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        code: 'I2',
        group: '9',
        message: 'You cannot get a Voters card without registering. Visit a registration center ' +
        'near you or the INEC office in your Local Government to get registered.',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {}).catch(error => logger.error(error));
  },

  down(queryInterface) {
    return queryInterface.bulkDelete('Notifications', null, {})
      .catch(error => logger.error(error));
  }
};
