const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('candystore_DB', 'postgres', 'GEoZsTgQAR46jFHK2PDt', {
//     host: 'containers-us-west-84.railway.app',
//     dialect: 'postgres',
//     define: {
//         timestamps: false
//     }
// });

const sequelize = new Sequelize('postgresqlpostgresql://postgres:ad5Mj8MlIffnSlVOeY7l@containers-us-west-84.railway.app:7763/railway', { define: { timestamps: false } });

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