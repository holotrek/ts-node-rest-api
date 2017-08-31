import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { IoC } from './src/ioc/ioc';
import { TodoListModels } from './src/api/models/todo-list-models';
import { TodoListRoutes } from './src/api/routes/todo-list-routes';

const app = express();
const port = process.env.PORT || 3000;

// Create the models
mongoose.model('Tasks', TodoListModels.initTaskSchema());

// Setup mongoose
(mongoose as any).Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', {
    useMongoClient: true
});

// Configure the express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup the IoC
const container = IoC.container;

// Register the routes
TodoListRoutes.configureRoutes(app, container);

// Add middleware to better catch and handle errors
app.use(function(req, res) {
    res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
