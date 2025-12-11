const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
// For Hostinger (MySQL), this would change to:
// const sequelize = new Sequelize('database', 'username', 'password', { host: 'localhost', dialect: 'mysql' });

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, 'scirecount.sqlite'),
    logging: false // Set to console.log to see SQL queries
});

module.exports = sequelize;
