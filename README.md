# ts-node-rest-api

This is a simple app created to try out a Node.js REST API that interacts with MongoDB by following this tutorial:
https://www.codementor.io/olatundegaruba/nodejs-restful-apis-in-10-minutes-q0sgsfhbd

However, it is written in TypeScript to provide better intellisense and easier extensibility to a full-fledged app.

# Prerequisites

* [MongoDB](https://www.mongodb.com/download-center#community)
  * Install MongoDB
  * If on Windows,
    * Create directory C:\data\db
    * Add the following (YMMV, depending on version) to your PATH enviornment variable: `C:\Program Files\MongoDB\Server\3.4\bin`
    * Open cmd prompt and type `mongod`

# Install

`npm install`

## Note on environments

* For settings you want to use in every environment, add them to [environments/env.ts](environments/env.ts).
* For environment-specific settings, the server will read from the particular env.{environment}.ts file for that environment, which is determined through the use of the user/system enviornment variable `NODE_ENVIRONMENT`. For example, if `NODE_ENVIRONMENT="Development"`, the settings from env.development.ts will override and/or be merged with settings from env.js

## HTTP Auth

* There are two strategies available for authorization without using a third party provider:
  * basic
    * This strategy is not recommended for production use unless the site is secured through SSL/TLS. It is good for quickly setting up an auth form for testing, because it requires no password hashing on the client side and uses a single API call.
  * digest
    * This strategy is more secure and can be used on HTTP to avoid sending plaintext passwords (although it is always recommended to use SSL/TLS anyway, if possible). It requires two API calls where the response of the first call provides a secret password to the client, which can be combined with the password provided and hashed to verify their identity.
    * Digest auth requires an environment variable called "ENCRYPTION_KEY" that is set to a random string of characters, which should be as long as random as you can possibly manage it. This avoids having passwords stored in plaintext in the database. If possible, it would also increase security to have the DB server (where encrypted passwords reside) be separate from the Web server (where the encryption key resides).
* It is recommended to turn on only one of these providers, as they share the same session tokens implementation.
* The environment keys `useBasicAuth` and `useDigestAuth` (boolean) are used to enable/disable the respective strategy.

## oAuth

* oAuth strategies available:
  * facebook
  * github
  * google

* Two keys exist for each type of oAuth Strategy: Client ID and Client Secret. If you are not using Source Control, you may be able to get away with putting them into one of the environment files (env.ts). However, this is not safe for committed code, so the alternative is to use the user/system environment variable option.

* In the following instructions, replace `STRATEGY` with the particular name of the strategy to implement (case sensitivity is important)
  * **Environment Files Option**
    * Add the following keys into one of the env.ts files:
      ```
      useStrategyAuth: true,
      strategyId: '<your client id>',
      strategySecret: '<your client secret>'
      ```
  * **User/System Environment Variables Option**
    * Add `useStrategyAuth: true` into one of the env.ts files.
    * Set the following environment variables:
      * `STRATEGY_CLIENT_ID="<your client id>"`
      * `STRATEGY_CLIENT_SECRET="<your client secret>"`

# Build & Run

* Make sure MongoDB is running ( `mongod` ) and then run:

`npm start`

# Test

`npm test`

# Prerequisites

* MongoDB server

# API

**NOTE**: API routes marked as "Authenticated" will require the following headers to be sent to avoid a 401 error (variables noted by angle brackets are found in the query string sent back from below Auth methods to the client callback url base_url/auth/success?querystring):
* `strategy: <strategy>`
* if strategy is an oauth strategy:
  * `access_token: <access_token>`
  * `refresh_token: <refresh_token>`
* if strategy is 'basic' or 'digest':
  * `Authorization: Bearer <session_token>`

## Tasks
* GET /tasks
  * List all available tasks
* GET /tasks/:taskId
  * Gets the single task identified by {taskId}
* POST /tasks
  * Authenticated
  * Create a task
* PUT /tasks/:taskId
  * Authenticated
  * Updates the task identified by {taskId}
* DELETE /tasks/:taskId
  * Authenticated
  * Deletes the task identified by {taskId}

## Auth
* GET /auth/strategies
  * Gets a list of strategies that have been enabled for the app.
* POST /auth/register
  * Adds a new user intended for basic or digest authentication
* GET /auth/basic
  * Logs in via basic authentication and receives a session token to use in "Authenticated" API requests
  * Requires header: `Authorization: Basic <bas64 user+pass>`
* GET /auth/logoff/:session
  * Logs off from the provided {session}

# Web Endpoints
* The following URLs are intended to be accessed via the web browser rather than an XHR request due to requiring a session:
  * /auth/digest
  * /auth/github
  * /auth/google
  * /auth/facebook
