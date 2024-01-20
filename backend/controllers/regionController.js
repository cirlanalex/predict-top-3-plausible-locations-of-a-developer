const { Octokit } = require("@octokit/rest");

const axios = require('axios');
const cheerio = require('cheerio');

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN
});

const guessLanguage = require('../lib/guessLanguage');
const Country = require('../models/country');
const Language = require('../models/language');
const CountryLanguage = require('../models/countryLanguage');

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

async function fetchData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (err) {
        throw err;
    }
}

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

const getRegionByTimezone = async (req, res) => {
    const url = `https://github.com/${req.params.username}`;

    try {
        const html = await fetchData(url);
        const $ = cheerio.load(html);

        const timezone = $('li[itemprop="localTime"] > span > profile-timezone').text();
        if (timezone === '') {
            return res.status(404).send();
        }
        return res.status(200).json({ Region: timezone });
    } catch (err) {
        return res.status(500).send();
    }

}

const getRegionByAll = async (req, res) => {
    try {
        const username = req.params.username;

        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        const location = user.location;

        if (location !== null) {
            return res.status(200).json({ Region: location });
        }

        const email = user.email;

        if (email !== null) {
            const region = await getCountryByEmail(email);

            if (region !== null) {
                return res.status(200).json({ Region: region });
            }
        }

        const website = user.blog;

        if (website !== null) {
            const region = await getCountryByWebsite(website);

            if (region !== null) {
                return res.status(200).json({ Region: region });
            }
        }

        const regions = await getRegionByLanguageFromRepos(username);

        if (regions.length > 0) {
            return res.status(200).json({ Regions: regions });
        }

        return res.status(404).send();
    } catch (err) {
        return res.status(500).send();
    }
}

module.exports = { getRegionByLanguage, getRegionByLocation, getRegionByEmail, getRegionByWebsite, getRegionByTimezone, getRegionByAll };