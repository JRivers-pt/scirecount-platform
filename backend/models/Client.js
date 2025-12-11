const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Client = sequelize.define('Client', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    plan: {
        type: DataTypes.STRING,
        defaultValue: 'Pro'
    },
    status: {
        type: DataTypes.STRING, // 'active', 'inactive'
        defaultValue: 'active'
    },
    locationsCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});

module.exports = Client;
