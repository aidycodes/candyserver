const { Sequelize, DataTypes } = require('sequelize');

module.exports = global.sequelize.define("order", {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    orderID: {
        type: DataTypes.UUID,
        allowNull: false
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,

    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false
    },
    qty: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    discount_code: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    final_price: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

})