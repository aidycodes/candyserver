const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('candystore_DB', 'postgres', 'TERA2022', {
    host: 'localhost',
    dialect: 'postgres',
    define: {
        timestamps: false
    }
});

module.exports = sequelize;
global.sequelize = sequelize;

const connection = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

connection()