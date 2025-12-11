const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Device = sequelize.define('Device', {
    deviceId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: 'New Sensor'
    },
    status: {
        type: DataTypes.STRING,
        defaultValue: 'online'
    },
    model: {
        type: DataTypes.STRING,
        defaultValue: 'TD2000'
    },
    // Current live counters (cache)
    lastIn: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastOut: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    currentOccupancy: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    lastUpdate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
});

module.exports = Device;
