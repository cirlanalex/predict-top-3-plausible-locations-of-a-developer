const Sequelize = require('sequelize');
const sequelize = require('../database');

const Country = sequelize.define('countries', {
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
    website: {
        type: Sequelize.STRING,
        allowNull: false,
    }
});

module.exports = Country;