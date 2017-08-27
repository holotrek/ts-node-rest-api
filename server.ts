import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { TodoListModel } from './api/models/todo-list-model';
import { TodoListRoutes } from './api/routes/todo-list-routes';

const app = express();
const port = process.env.PORT || 3000;

// Create the models
mongoose.model('Tasks', TodoListModel.initTaskSchema());

// Setup mongoose
(mongoose as any).Promise = global.Promise;
mongoose.connect('mongodb://localhost/Tododb', {
	useMongoClient: true
});

// Configure the express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Register the routes
TodoListRoutes.configureRoutes(app);

// Add middleware to better catch and handle errors
app.use(function(req, res) {
	res.status(404).send({url: req.originalUrl + ' not found'})
});

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
