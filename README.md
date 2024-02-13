# Predict the top 3 plausible locations of a software developer
The main aim of this project is to create a plugin for GitHub that can predict the
top three plausible geographical locations of a software developer. This prediction is based on multiple pieces of information available from the user's GitHub profile. The following sources of information are utilized:
 - location set on the user's profile
 - email address set to public on the user's profile
 - personal website set on the user's profile
 - language usage in READMEs from the user's public repositories
 - the time zone set on the user's profile

## Database
The project employs MariaDB as the database management system due to its popularity and familiarity among the project developers.

Data for this project are sourced from various places and manually added into CSV files located in "./csvfiles" directory for import into the database. These data files include:
  - countries:
    - contains the names of the countries (source: https://www.britannica.com/topic/list-of-countries-1993160)
    - contains the specific top-level domain for the country (source: https://en.wikipedia.org/wiki/List_of_Internet_top-level_domains)
  - languages:
    - contains the names of the languages supported by the guessLanguage.js library (source: https://github.com/richtr/guessLanguage.js)
    - contains the code returned by the library for that specific language
  - timezones:
    - contains the names of the time zones shown by GitHub on profiles (UTC)
    - contains the starting working hour assuming people work from 9 am to 5 pm (based on UTC+01:00) (DISCLAIMER: THIS IS NOT USED IN THE PROJECT BECAUSE WE FOUND ANOTHER WAY TO DETECT TIME ZONE)
  - countries_languages:
    - connects the IDs of the languages to the IDs of the countries that are spoken into (source: https://en.wikipedia.org/wiki/List_of_official_languages_by_country_and_territory)
  - countries_timezones:
    - connects the IDs of the time zones to the IDs of the countries that have that specific time zone

## Backend
The backend of the system is built using ExpressJS and is responsible for fetching information from the GitHub API and returning the possible countries where the user may be located. The backend exposes several routes:
  - /:username/getRegionByLocation (retrieves location based on the user's profile location)
    - return example: {Region: "region"}
  - /:username/getRegionByEmail (determines location based on the email extension set on the user's profile)
    - return example: {Region: "region"}
  - /:username/getRegionByWebsite (determines location based on the domain extension of the personal website set on the user's profile)
    - return example: {Region: "region"}
  - /:username/getRegionByLanguage (identifies countries based on the language usage in READMEs from the user's public repositories)
    - return example: {Regions: ["region1", "region2"]}
  - /:username/getRegionByTimezone (determines countries based on the time zone set on the user's profile)
    - return example: {Regions: ["region1", "region2"]}
  - /:username/getRegionByAll (integrates all methods mentioned above to predict user location)
    - return example: {Regions: [{Region: "region1", Percentage: 85, From: ["Location", "Website"]}, {Region: "region2", Percentage: 15, From: ["Email", "Language"]}]}

Focus is placed on the "/:username/getRegionByAll" route as it integrates multiple methods for location prediction and it is the one route used in the frontend.

## Frontend
The frontend of the system is built using React and is responsible for providing a user interface to interact with the location prediction functionality.

Features:
  - input field (users can input the username of the person they want to find the location for)
  - search button (initiates the search for the user's location based on the provided username)
  - checkbox (allows users to indicate whether they want to see more than the top 3 predicted locations)
  - result table (displays the predicted locations with three columns)
    - region (the geographical region where the user is predicted to be located)
    - relevance (the probability or relevance level associated with the prediction)
    - from (indicates where the region prediction was extracted from):
      - Location
      - Email
      - Website
      - Language
      - Time Zone

## Choices
Everything can be configured except for the aspect specifically selected, wherein the significance of the email extension matches that of the website's top-level domain. This choice was made because both act as ways to locate based on domain extensions.

## Data interpretation
The GitHub accounts contain multiple information sources that can be used when accessing a
user’s plausible location. All the identified sources are integrated into accessing the geographical
location, which will be further referred to as the location guess.

When only one information source is identified within the account, the location guess is entirely
based on it. However, when multiple sources are present at the same time, they are not all equally
important for the estimation of the location. The system logic designed for the interpretation of
the information sources is as follows:
  - when one single information source is present, it counts for 100% of the location guess
  - when more information sources are present
    - the information sources are checked in the following order:
      - location field
      - email and personal website fields
      - language
      - time zone
    - every found information source
      - has an assigned relevance level expressed as a percentage of the
remaining location guess
    - system logic:
      - the location guess is initially at 100%
      - the relevance level of each found information source is subtracted from
the location guess
      - the last information source encountered represents all the remaining
location guess percentage

NOTE: the order matters, so even if we see 100% relevance level for time zone field, it will still have the lowest relevance because it is 100% from the remaining of the location guess.

| Data                   | Importance | Relevance level* |
| ---------------------- | ---------- | ---------------- |
| Location field         | High       | 80%              |
| Email field            | Medium     | 50%              |
| Personal website field | Medium     | 50%              |
| Language               | Low        | 50%              |
| Time zone field        | Low        | 100%             |

*the relevance levels have been arbitrarily chosen and can be changed within the .env file of the project

## Environmental variables
The project utilizes an environment file ".env.example"(rename to ".env") for configuration. The following variables are included:
  - DATABASE_ROOT_PASSWORD (root password for the database)
  - DATABASE_USER (database user)
  - DATABASE_PASSWORD (database password)
  - DATABASE_NAME (name of the database)
  - DATABASE_PORT (port for the database)
  - BACKEND_HOST (host for the backend)
  - BACKEND_PORT (port for the backend)
  - FRONTEND_PORT (port for the frontend)
  - BACKEND (link to the backend API)
  - GITHUB_TOKEN (GitHub Token for API access)
  - DEFAULT_LOCATION_PERCENTAGE (relevance for location set on the profile - from 0 to 100)
  - DEFAULT_EMAIL_WEBSITE_PORTION (relevance for email and website - from 0 to 100)
  - DEFAULT_LANGUAGE_PORTION (relevance for language - from 0 to 100)

## Docker
The project makes use of Docker to containerize and manage its dependencies, ensuring uniformity and flexibility across various environments.

Commands to run:
  - docker compose build
  - docker compose up