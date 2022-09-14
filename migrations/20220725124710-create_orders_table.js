'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      orderID: {
        type: Sequelize.UUID,
        allowNull: false
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,

      },
      product_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      order_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      qty: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      price: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      discount_code: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      final_price: {
        type: Sequelize.INTEGER,
        allowNull: false
      }

    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.dropTable('orders');
  }
};


