'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('movie', 'poster', {
        type: Sequelize.STRING,
    });
  },
  down: async (queryInterface, Sequelize) => {
      await queryInterface.changeColumn('movie', 'poster', {
          type: Sequelize.INTEGER,
      });
  },
};
