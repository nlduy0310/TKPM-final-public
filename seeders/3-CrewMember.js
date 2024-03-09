'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = require('./sample_data/members.json');
    items.forEach((item) => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('CrewMembers', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CrewMembers', null, {});
    await queryInterface.sequelize.query('ALTER SEQUENCE public."CrewMembers_id_seq" RESTART WITH 1;');
  }
};
