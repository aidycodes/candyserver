const { Sequelize, DataTypes } = require('sequelize');

module.exports = global.sequelize.define("Cart", {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    customer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    items: {
        type: DataTypes.ARRAY(DataTypes.JSON),
        allowNull: true,


    }
})