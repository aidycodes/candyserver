'use strict';
const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("Carts", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      items: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,
      }
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('Carts');

  }
};
