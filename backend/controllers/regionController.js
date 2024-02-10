const { Octokit } = require("@octokit/rest");

const axios = require('axios');
const cheerio = require('cheerio');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const guessLanguage = require('../lib/guessLanguage');
const Country = require('../models/country');
const Language = require('../models/language');
const Timezone = require('../models/timezone');
const CountryLanguage = require('../models/countryLanguage');
const CountryTimezone = require('../models/countryTimezone');

// Function to detect the language of a text
function detectLanguage(content) {
    let language = null;
    guessLanguage.guessLanguage.detect(content, (languageName) => {
        if (languageName === 'unknown' || languageName === 'en') {
            return null;
        }
        language = languageName;
    });
    return language;
}

// Function to get the most frequent language from an array of languages
function getMostUsedLanguage(languages) {
    let maxCount = 0;
    let maxLanguages = [];
    let languageCounts = {};
    for (const language of languages) {
        if (languageCounts[language] === undefined) {
            languageCounts[language] = 0;
        }
        languageCounts[language]++;
        if (languageCounts[language] > maxCount) {
            maxCount = languageCounts[language];
            maxLanguages = [language];
        } else if (languageCounts[language] === maxCount) {
            maxLanguages.push(language);
        }
    }
    return maxLanguages;
}

// Function to get the regions from an array of languages
async function getRegionsFromLanguages(languages) {
    let regions = [];
    for (const maxLanguage of languages) {
        await Language.findOne({
            where: {
                code: maxLanguage,
            },
        }).then(async (language) => {
            if (language === null) {
                return;
            }
            await CountryLanguage.findAll({
                where: {
                    id_language: language.id,
                },
            }).then(async (countryLanguages) => {
                for (const countryLanguage of countryLanguages) {
                    await Country.findOne({
                        where: {
                            id: countryLanguage.id_country,
                        },
                    }).then((country) => {
                        if (country === null || regions.includes(country.name)) {
                            return;
                        }
                        regions.push(country.name);
                    });
                }
            });
        });
    }
    return regions;
}

// Function to get the regions from the repositories of a user
async function getRegionByLanguageFromRepos(username) {
    let regions = [];

    const { data: repos } = await octokit.repos.listForUser({
        username: username,
        type: 'public',
    });

    if (repos.length === 0) {
        return regions;
    }

    const detectedLanguages = [];

    for (const repo of repos) {
        try {
            const readme = await octokit.repos.getReadme({
                owner: username,
                repo: repo.name,
            });

            const readmeContent = Buffer.from(readme.data.content, 'base64').toString();

            if (readmeContent.length < 200) {
                continue;
            }

            let detectedLanguage = detectLanguage(readmeContent);

            if (detectedLanguage === null) {
                continue;
            }

            detectedLanguages.push(detectedLanguage);

        } catch (err) {
            if (err.status === 404) {
                continue;
            } else {
                throw err;
            }
        }
    }

    if (detectedLanguages.length > 0) {
        // Get the most frequent language
        const maxLanguages = getMostUsedLanguage(detectedLanguages);
        
        // Get the regions from the most frequent languages
        regions = await getRegionsFromLanguages(maxLanguages);
    }

    return regions;
}

// Function to get the region from a website
async function getCountryByWebsite(website) {
    const websiteParts = website.split('.');

    let region = websiteParts[websiteParts.length - 1].split('/')[0].toLowerCase();

    await Country.findOne({
        where: {
            website: region,
        },
    }).then(async (country) => {
        if (country === null) {
            region = null;
            return;
        }
        region = country.name;
    });

    return region;
}

// Function to get the region from an email
async function getCountryByEmail(email) {
    const emailParts = email.split('@');

    const domain = emailParts[1];

    const domainParts = domain.split('.');

    let region = domainParts[domainParts.length - 1].toLowerCase();

    await Country.findOne({
        where: {
            website: region,
        },
    }).then(async (country) => {
        if (country === null) {
            region = null;
            return;
        }
        region = country.name;
    });

    return region;
}

// Function to get the countries from a timezone
async function getCountriesByTimezone(timezone) {
    let countries = [];

    await Timezone.findOne({
        where: {
            name: timezone,
        },
    }).then(async (timezone) => {
        if (timezone === null) {
            return;
        }
        await CountryTimezone.findAll({
            where: {
                id_timezone: timezone.id,
            },
        }).then(async (countryTimezones) => {
            for (const countryTimezone of countryTimezones) {
                await Country.findOne({
                    where: {
                        id: countryTimezone.id_country,
                    },
                }).then((country) => {
                    if (country === null || countries.includes(country.name)) {
                        return;
                    }
                    countries.push(country.name);
                });
            }
        });
    });

    return countries;
}

// Function to fetch data from an URL
async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        throw err;
    }
}

// Function to get the timezone of a user
async function getTimezone(username) {
    const url = `https://github.com/${username}`;

    try {
        const html = await fetchData(url);
        const $ = cheerio.load(html);

        const timezone = $('li[itemprop="localTime"] > span > profile-timezone').text().slice(1, -1);
        if (timezone === '') {
            return null;
        }

        return timezone;
    } catch (err) {
        throw err;
    }
}

// Function to add a region to the result
function addRegionToResult(regions, region, percentage, from) {
    for (const regionObj of regions) {
        if (regionObj.Region === region) {
            regionObj.Percentage += percentage;
            regionObj.From.push(from);
            return;
        }
    }
    regions.push({ Region: region, Percentage: percentage, From: [from] });
}

// Functions to get the region of a user by language
const getRegionByLanguage = async (req, res) => {
    try {
        const username = req.params.username;

        const regions = await getRegionByLanguageFromRepos(username);

        if (regions.length === 0) {
            return res.status(404).send();
        }

        return res.status(200).json({ Regions: regions });
    } catch (err) {
        return res.status(500).send();
    }
}

// Function to get the region of a user by location
const getRegionByLocation = async (req, res) => {
    try {
        const username = req.params.username;
        
        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        const location = user.location;

        if (location === null) {
            return res.status(404).send();
        }
        
        return res.status(200).json({ Region: location });
    } catch (err) {
        return res.status(500).send();
    }
}

// Function to get the region of a user by email
const getRegionByEmail = async (req, res) => {
    try {
        const username = req.params.username;

        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        const email = user.email;

        if (email === null) {
            return res.status(404).send();
        }

        const region = await getCountryByEmail(email);

        if (region === null) {
            return res.status(404).send();
        }

        return res.status(200).json({ Region: region });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

// Function to get the region of a user by website
const getRegionByWebsite = async (req, res) => {
    try {
        const username = req.params.username;

        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        const website = user.blog;

        if (website === null) {
            return res.status(404).send();
        }

        const region = await getCountryByWebsite(website);

        if (region === null) {
            return res.status(404).send();
        }

        return res.status(200).json({ Region: region });
    } catch (err) {
        return res.status(500).send();
    }
}

// Function to get the region of a user by timezone
const getRegionByTimezone = async (req, res) => {
    try {
        const username = req.params.username;

        const timezone = await getTimezone(username);

        const regions = await getCountriesByTimezone(timezone);

        if (regions.length === 0) {
            return res.status(404).send();
        }

        return res.status(200).json({ Region: regions });
    } catch (err) {
        return res.status(500).send();
    }

}

// Function to get the region of a user by all the available methods
const getRegionByAll = async (req, res) => {
    try {
        const username = req.params.username;

        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        // Variables to store the regions found by each method
        let foundLocation = null;
        let foundEmail = null;
        let foundWebsite = null;
        let foundLanguage = null;
        let foundTimezone = null;

        const location = user.location;

        if (location !== null) {
            foundLocation = location;
        }

        const email = user.email;

        if (email !== null) {
            const region = await getCountryByEmail(email);

            if (region !== null) {
                foundEmail = region;
            }
        }

        const website = user.blog;

        if (website !== null) {
            const region = await getCountryByWebsite(website);

            if (region !== null) {
                foundWebsite = region;
            }
        }

        let regions = await getRegionByLanguageFromRepos(username);

        if (regions.length > 0) {
            foundLanguage = regions;
        }

        const timezone = await getTimezone(username);

        if (timezone !== null) {
            regions = await getCountriesByTimezone(timezone);

            if (regions.length > 0) {
                foundTimezone = regions;
            }
        }

        // Variables to store the percentage of each method
        let remainPercentage = 100;
        let locationPercentage = 0;
        let emailPercentage = 0;
        let websitePercentage = 0;
        let languagePercentage = 0;
        let timezonePercentage = 0;

        if (foundLocation !== null) {
            if (foundEmail !== null || foundWebsite !== null || foundLanguage !== null || foundTimezone !== null) {
                // If the location is not the only method that found a region, give it a percentage of 80
                locationPercentage = 80;
                remainPercentage -= locationPercentage;
            } else {
                // If there is no other method that found a region, give the location the remaining percentage
                locationPercentage = remainPercentage;
                remainPercentage -= locationPercentage;
            }
        }

        if (foundEmail !== null) {
            if (foundLanguage !== null || foundTimezone !== null) {
                // If the email is not the only method that found a region, give it a percentage of 50% from the remaining percentage
                emailPercentage = remainPercentage / 2;
                remainPercentage -= emailPercentage;
            } else {
                // If the email is the only method that found a region, give it the remaining percentage
                emailPercentage = remainPercentage;
                remainPercentage -= emailPercentage;
            }
        }

        if (foundWebsite !== null) {
            if (foundEmail !== null) {
                // If email was found, split the email percentage with the website
                emailPercentage = emailPercentage / 2;
                websitePercentage = emailPercentage;
            } else if (foundLanguage !== null || foundTimezone !== null) {
                // If the website is not the only method that found a region, give it a percentage of 50% from the remaining percentage
                websitePercentage = remainPercentage / 2;
                remainPercentage -= websitePercentage;
            } else {
                // If there is no other method that found a region, give the website the remaining percentage
                websitePercentage = remainPercentage;
                remainPercentage -= websitePercentage;
            }
        }

        if (foundLanguage !== null) {
            if (foundTimezone !== null) {
                // If the language is not the only method that found a region, give it a percentage of 50% from the remaining percentage
                languagePercentage = remainPercentage / 2;
                remainPercentage -= languagePercentage;
            } else {
                // If there is no other method that found a region, give the language the remaining percentage
                languagePercentage = remainPercentage;
                remainPercentage -= languagePercentage;
            }
        }

        if (foundTimezone !== null) {
            // Give the timezone the remaining percentage
            timezonePercentage = remainPercentage;
            remainPercentage -= timezonePercentage;
        }

        // If the remaining percentage is not 0, return 404 (no region found by all methods)
        if (remainPercentage === 0) {
            let regions = [];

            if (foundLocation !== null) {
                addRegionToResult(regions, foundLocation, locationPercentage, 'Location');
            }

            if (foundEmail !== null) {
                addRegionToResult(regions, foundEmail, emailPercentage, 'Email');
            }

            if (foundWebsite !== null) {
                addRegionToResult(regions, foundWebsite, websitePercentage, 'Website');
            }

            if (foundLanguage !== null) {
                let length = foundLanguage.length;
                for (const region of foundLanguage) {
                    addRegionToResult(regions, region, languagePercentage / length, 'Language');
                }
            }

            if (foundTimezone !== null) {
                let length = foundTimezone.length;
                for (const region of foundTimezone) {
                    addRegionToResult(regions, region, timezonePercentage / length, 'Timezone');
                }
            }

            regions.sort((a, b) => b.Percentage - a.Percentage);

            return res.status(200).json({ Regions: regions });
        }

        return res.status(404).send();
    } catch (err) {
        return res.status(500).send();
    }
}

module.exports = { getRegionByLanguage, getRegionByLocation, getRegionByEmail, getRegionByWebsite, getRegionByTimezone, getRegionByAll };