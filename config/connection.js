// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config(); // Passes database name, username, and password securely

// create connection to our database, pass in your MySQL information for username and password
const sequelize = new Sequelize(process.env.DB_Name, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});
// The new Sequelize() function accepts the database name, MySQL username, and MySQL password (respectively) as parameters, 
// then we also pass configuration settings. Once we're done, we simply export the connection.

module.exports = sequelize;