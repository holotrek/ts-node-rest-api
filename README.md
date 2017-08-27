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

# Build & Run

* Make sure MongoDB is running ( `mongod` ) and then run:

`npm start`

# Test (TBD)

`npm test`

# Prerequisites

* MongoDB server

# Notes for later...

## TODO

* Get mongoose to correctly register the model
* Setup Karma and some tests

## Commands used to create the files in this project

`npm init`

`npm i -g editorconfig-cli`

`ec init`

`npm i -g typescript`

`tsc --init`

`npm i -g tslint`

`tslint --init`
