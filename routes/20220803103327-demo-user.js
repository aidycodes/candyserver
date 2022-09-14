'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{

      email: 'example@example.com',
      isAdmin: false,
      password: 'Password21',
      salt: 'password',
      address: 'demo address',
      country: 'demo country',
      county: 'demo county',
      phone: 1234567890

    }]);
  },


  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
