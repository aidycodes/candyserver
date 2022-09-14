const { DataTypes } = require('sequelize');

module.exports = global.sequelize.define("Category", {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    imgUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
    }
})