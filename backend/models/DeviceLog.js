const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const DeviceLog = sequelize.define('DeviceLog', {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false
    },
    inCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    outCount: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    occupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = DeviceLog;
