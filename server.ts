import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { TodoListModels } from './src/api/models/todo-list-models';
import { TodoListRoutes } from './src/api/routes/todo-list-routes';
import { UserProvider } from './src/providers/user.provider';

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

// Setup Authentication
const userProvider = new UserProvider();

// Register the routes
TodoListRoutes.configureRoutes(app, userProvider);

// Add Middleware (TODO: Move each to a separate file)
app.use((req, res, next) => {
    // Authenticate user and store data in user provider
    const authHeader = req.headers['authorization'];
    // TODO: Pass to an AuthenticationProvider
    next();
});
app.use((req, res, next) => {
    // Show message for 404 errors
    res.status(404).send({error: req.originalUrl + ' not found'});
    next();
});
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Show error without details (and log them) for 500 errors
    res.status(500).send({error: 'Unexpected error occurred'});
    // TODO: Log ${err}
    next();
});

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
