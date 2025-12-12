const { Sequelize } = require('sequelize');
const path = require('path');

// Initialize Sequelize with SQLite
// For Hostinger (MySQL), this would change to:
// const sequelize = new Sequelize('database', 'username', 'password', { host: 'localhost', dialect: 'mysql' });

const { Sequelize } = require('sequelize');
const path = require('path');

// Check for DATABASE_URL environment variable (Provided by Render/Neon)
const databaseUrl = process.env.DATABASE_URL;

let sequelize;

if (databaseUrl) {
    // Production: Use PostgreSQL
    console.log('🌍 Connected to Remote Database (PostgreSQL)');
    sequelize = new Sequelize(databaseUrl, {
        dialect: 'postgres',
        protocol: 'postgres',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // Required for some cloud DBs (Render/Neon)
            }
        },
        logging: false
    });
} else {
    // Local: Use SQLite
    console.log('💻 Connected to Local Database (SQLite)');
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: path.join(__dirname, 'scirecount.sqlite'),
        logging: false
    });
}

module.exports = sequelize;
