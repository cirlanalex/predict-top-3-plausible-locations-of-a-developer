const Sequelize = require('sequelize');
const sequelize = require('../database');
const Country = require('./country');
const Language = require('./language');

const CountryLanguage = sequelize.define('countries_languages', {
    id_country: {
        type: Sequelize.INTEGER,
        references: {
            model: Country,
            key: 'id'
        }
    },
    id_language: {
        type: Sequelize.INTEGER,
        references: {
            model: Language,
            key: 'id'
        }
    }
});

Country.belongsToMany(Language, { through: CountryLanguage, foreignKey: 'id_country' });
Language.belongsToMany(Country, { through: CountryLanguage, foreignKey: 'id_language' });

module.exports = CountryLanguage;