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
    - percentage (the probability or confidence level associated with the prediction)
    - from: (indicates where the region prediction was extracted from)
      - Location
      - Email
      - Website
      - Language
      - Time Zone

## Choices
Everything can be configured except for the aspect specifically selected, wherein the significance of the email extension matches that of the website's top-level domain. This choice was made because both act as ways to locate based on domain extensions.

## Details
The backend accepts a GitHub username as input to predict the potential location of the user. The prediction process involves the following steps:
  1. Check if the user has set their location on the profile. If set:
      - assign this location as the result with 100% confidence if no other locations are detected from other methods
      - otherwise, allocate a percentage of confidence (configured via DEFAULT_LOCATION_PERCENTAGE) if additional information is available
  2. Check if the user's email address is public and extract the country based on the email extension. If available:
      - add this location as a result with the remaining confidence if no other locations are detected from language or time zone methods
      - otherwise, allocate a percentage of confidence (configured via DEFAULT_EMAIL_WEBSITE_PORTION) if additional information from language or time zone methods is available
  3. Check if the user has a personal website set on the profile and take the country from the top-level domain. If available:
      - add this location as a result with half of the email confidence, but also reduce the confidence of the mail to half if the email method found a location
      - otherwise, allocate a percentage of confidence (configured via DEFAULT_EMAIL_WEBSITE_PORTION) if additional information from language or time zone methods is available
      - otherwise, add this location as a result with the remaining confidence if no other locations are detected from language or time zone methods
  4. Determine the most used language by the user in READMEs, excluding English. If detected:
      - add the locations that speak that language with the remaining confidence and split it between all the locations if no other locations are detected from the time zone method
      - otherwise, allocate a percentage of confidence (configured via DEFAULT_LANGUAGE_PORTION) and split it between the countries that speak that language if additional information from the time zone method is available
  5. Determine the user's time zone (scraped since GitHub API does not provide this). If detected:
      - add the locations that are in that time zone with the remaining confidence and split it between all the locations
  6. If no method detects at least one potential location, return a 204 status code.

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
  - DEFAULT_LOCATION_PERCENTAGE (weightage for location set on the profile - from 0 to 100)
  - DEFAULT_EMAIL_WEBSITE_PORTION (weightage for email and website - from 0.0 to 1.0)
  - DEFAULT_LANGUAGE_PORTION (weightage for language - from 0.0 to 1.0)

## Docker
The project makes use of Docker to containerize and manage its dependencies, ensuring uniformity and flexibility across various environments.

Commands to run:
  - docker compose build
  - docker compose up