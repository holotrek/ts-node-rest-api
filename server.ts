import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

import { TodoListModels } from './src/api/models/todo-list-models';
import { TodoListRoutes } from './src/api/routes/todo-list-routes';
import { UserRepository } from './src/data/user.repository';
import * as ENV from './src/functions/env-funcs';
import { AuthMiddleware } from './src/middleware/auth.middleware';
import { BasicAuthFactory } from './src/middleware/basic-auth.middleware';
import { ErrorMiddleware } from './src/middleware/error.middleware';
import { FacebookAuthFactory } from './src/middleware/facebook-auth.middleware';
import { GithubAuthFactory } from './src/middleware/github-auth.middleware';
import { GoogleAuthFactory } from './src/middleware/google-auth.middleware';
import { CryptoHashProvider } from './src/providers/hash.provider';
import { UserProvider } from './src/providers/user.provider';
import { UserService, UserServiceSettings } from './src/services/user.service';

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

// Setup Authentication
const userProvider = new UserProvider();
const authMiddleware = new AuthMiddleware([
    new FacebookAuthFactory(),
    new GithubAuthFactory(),
    new GoogleAuthFactory(),
    new BasicAuthFactory()
], environment, userProvider, new UserService(new UserRepository(), new CryptoHashProvider(), new UserServiceSettings(environment.sessionTimeout)));
authMiddleware.initialize(app);

// Register the routes
TodoListRoutes.configureRoutes(app, userProvider, authMiddleware);
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
