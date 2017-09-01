import 'reflect-metadata';

import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

import { TodoListModels } from './src/api/models/todo-list-models';
import { TodoListRoutes } from './src/api/routes/todo-list-routes';
import * as ENV from './src/functions/env-funcs';
import { IoC } from './src/ioc/ioc';
import { TYPES } from './src/ioc/types';
import { AuthMiddleware } from './src/middleware/auth.middleware';
import { BasicAuthFactory } from './src/middleware/basic-auth.middleware';
import { DigestAuthFactory } from './src/middleware/digest-auth.middleware';
import { ErrorMiddleware } from './src/middleware/error.middleware';
import { FacebookAuthFactory } from './src/middleware/facebook-auth.middleware';
import { GithubAuthFactory } from './src/middleware/github-auth.middleware';
import { GoogleAuthFactory } from './src/middleware/google-auth.middleware';
import { UserProviderInterface } from './src/providers/user.provider.interface';
import { UserServiceSettings } from './src/services/user.service';
import { UserServiceInterface } from './src/services/user.service.interface';

const app = express();
const port = process.env.PORT || 3000;
const env = (process.env.NODE_ENVIRONMENT || 'development').toLowerCase();
let environment = require(`./environments/env.js`).environment || {};
environment = ENV.mergeEnvironments(environment, (require(`./environments/env.${env}.js`).environment || {}));
environment.facebookId = environment.facebookId || process.env.FACEBOOK_CLIENT_ID || '';
environment.facebookSecret = environment.facebookSecret || process.env.FACEBOOK_CLIENT_SECRET || '';
environment.githubId = environment.githubId || process.env.GITHUB_CLIENT_ID || '';
environment.githubSecret = environment.githubSecret || process.env.GITHUB_CLIENT_SECRET || '';
environment.googleId = environment.googleId || process.env.GOOGLE_CLIENT_ID || '';
environment.googleSecret = environment.googleSecret || process.env.GOOGLE_CLIENT_SECRET || '';
console.log(environment);

// Create the model schemas
mongoose.model('Tasks', TodoListModels.initTaskSchema());
mongoose.model('Users', TodoListModels.initUserSchema());

// Setup mongoose
(mongoose as any).Promise = global.Promise;
mongoose.connect(environment.connectionString, {
    useMongoClient: true
});

// Configure the express app
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// Setup the IoC
const constants: { [key: string]: any } = {};
constants.encryptionKey = process.env.ENCRYPTION_KEY as string;
constants.sessionTimeout = environment.sessionTimeout;
const container = IoC.configureContainer(constants);

// Setup Authentication
const authMiddleware = new AuthMiddleware(
    [
        new BasicAuthFactory(),
        new DigestAuthFactory(),
        new FacebookAuthFactory(),
        new GithubAuthFactory(),
        new GoogleAuthFactory()
    ],
    environment,
    container.get<UserProviderInterface>(TYPES.UserProvider),
    container.get<UserServiceInterface>(TYPES.UserService)
);
authMiddleware.initialize(app);

// Register the routes
TodoListRoutes.configureRoutes(app, container, authMiddleware);
app.get('/auth/strategies', (req, res) => {
    res.json(authMiddleware.getEnabledAuthStrategies());
});

// Add Middleware
const errorMiddleware = new ErrorMiddleware(environment);
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => errorMiddleware.notFound(req, res, next));
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) =>
    errorMiddleware.internalServerError(environment, err, req, res, next));

try {
    app.listen(port);
}
catch (err) {
    console.error(`Failed to listen on port ${port}. Set the environment variable PORT to run on a different port.`)
}

console.log('todo list RESTful API server started on: ' + port);
