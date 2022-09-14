'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("products", {

      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brand: {
        type: Sequelize.STRING,
        allowNull: false
      },
      imgUrl: {
        type: Sequelize.STRING,
        allowNull: false
      },
      category: {
        type: Sequelize.STRING,
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      desc: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      price: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      discount_percent: {
        type: Sequelize.INTEGER,
        allowNull: true
      }


    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('products');
  }
};

