'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let items = require('./sample_data/movie_directors.json');
    items.forEach((item) => {
      item.createdAt = Sequelize.literal('NOW()');
      item.updatedAt = Sequelize.literal('NOW()');
    });
    await queryInterface.bulkInsert('MovieDirectors', items, {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('MovieDirectors', null, {});
  }
};
