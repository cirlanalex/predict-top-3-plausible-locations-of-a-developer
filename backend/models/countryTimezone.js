const Sequelize = require('sequelize');
const sequelize = require('../database');
const Country = require('./country');
const Timezone = require('./timezone');

const CountryTimezone = sequelize.define('countries_timezones', {
    id_country: {
        type: Sequelize.INTEGER,
        references: {
            model: Country,
            key: 'id'
        }
    },
    id_timezone: {
        type: Sequelize.INTEGER,
        references: {
            model: Timezone,
            key: 'id'
        }
    }
});

Country.belongsToMany(Timezone, { through: CountryTimezone, foreignKey: 'id_country' });
Timezone.belongsToMany(Country, { through: CountryTimezone, foreignKey: 'id_timezone' });

module.exports = CountryTimezone;