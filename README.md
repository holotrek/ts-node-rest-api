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

## Tasks
* GET /tasks
  * List all available tasks
* POST /tasks
  * Create a task
* GET /tasks/:taskId
  * Gets the single task identified by {taskId}
* PUT /tasks/:taskId
  * Updates the task identified by {taskId}
* DELETE /tasks/:taskId
  * Deletes the task identified by {taskId}

## Auth
* The following URLs are intended to be accessed via the web browser rather than an XHR request:
  * /auth/github
  * /auth/google
  * /auth/facebook
* GET /auth/strategies
  * Gets a list of strategies that have been enabled for the app.
