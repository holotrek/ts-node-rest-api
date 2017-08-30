import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';

import { TodoListModels } from './src/api/models/todo-list-models';
import { TodoListRoutes } from './src/api/routes/todo-list-routes';
import * as ENV from './src/functions/env-funcs';
import { AuthMiddleware } from './src/middleware/auth.middleware';
import { ErrorMiddleware } from './src/middleware/error.middleware';
import { UserProvider } from './src/providers/user.provider';
import { UserService } from './src/services/user.service';

const app = express();
const port = process.env.PORT || 3000;
const env = (process.env.NODE_ENVIRONMENT || 'development').toLowerCase();
let environment = require(`./environments/env.js`).environment || {};
environment = ENV.mergeEnvironments(environment, (require(`./environments/env.${env}.js`).environment || {}));
environment.googleId = environment.googleId || process.env.GOOGLE_CLIENT_ID || '';
environment.googleSecret = environment.googleSecret || process.env.GOOGLE_CLIENT_SECRET || '';

// Create the models
mongoose.model('Tasks', TodoListModels.initTaskSchema());

// Setup mongoose
(mongoose as any).Promise = global.Promise;
mongoose.connect(environment.connectionString, {
    useMongoClient: true
});

// Configure the express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Setup Authentication
const userProvider = new UserProvider();
const authMiddleware = new AuthMiddleware(environment, userProvider, new UserService());
authMiddleware.initialize(app);

// Register the routes
TodoListRoutes.configureRoutes(app, userProvider);

// Add Middleware
const errorMiddleware = new ErrorMiddleware(environment);
app.use((req, res, next) => errorMiddleware.notFound(req, res, next));
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>
    errorMiddleware.internalServerError(environment, err, req, res, next));

app.listen(port);
console.log('todo list RESTful API server started on: ' + port);
