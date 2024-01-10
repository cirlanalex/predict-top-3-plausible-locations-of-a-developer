const { Octokit } = require("@octokit/rest");

const octokit = new Octokit();

const guessLanguage = require('../lib/guessLanguage');

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

const getRegionByLanguage = async (req, res) => {
    try {
        const username = req.params.username;
        
        const { data: repos } = await octokit.repos.listForUser({
            username: username,
            type: 'public',
        });

        if (repos.length === 0) {
            return res.status(404).send();
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

                const detectedLanguage = detectLanguage(readmeContent);

                if (detectedLanguage === null) {
                    continue;
                }

                // print repo name
                console.log(repo.name);

                detectedLanguages.push(detectedLanguage);
            } catch (err) {
                if (err.status === 404) {
                    continue;
                } else {
                    throw err;
                }
            }
        }

        return res.status(200).json(detectedLanguages);
    } catch (err) {
        console.log(err);
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
        console.log(err);
        return res.status(500).send();
    }
}

const getRegionByEmail = async (req, res) => {
    try {
        const username = req.params.username;

        const { data: user } = await octokit.users.getByUsername({
            username: username,
        });

        console.log(user);

        const email = user.email;

        if (email === null) {
            return res.status(404).send();
        }

        const emailParts = email.split('@');

        const domain = emailParts[1];

        const domainParts = domain.split('.');

        const region = domainParts[domainParts.length - 1];

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

        const websiteParts = website.split('.');

        const region = websiteParts[websiteParts.length - 1].split('/')[0];

        return res.status(200).json({ Region: region });
    } catch (err) {
        console.log(err);
        return res.status(500).send();
    }
}

module.exports = { getRegionByLanguage, getRegionByLocation, getRegionByEmail, getRegionByWebsite };