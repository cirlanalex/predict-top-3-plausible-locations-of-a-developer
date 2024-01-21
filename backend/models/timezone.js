const Sequelize = require('sequelize');
const sequelize = require('../database');

const Timezone = sequelize.define('timezones', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        unique: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    start: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    end: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Timezone;