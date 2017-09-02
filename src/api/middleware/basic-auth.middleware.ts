import * as express from 'express';
import * as passport from 'passport';
import * as passportHttp from 'passport-http';

import { BasicAuthUserModel } from '../../domain/user-model';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserServiceInterface } from '../../services/user.service.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { HttpAuthMiddleware } from './http-auth.middleware';

export class BasicAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface {
        return new BasicAuthMiddleware(environment, userProvider, userService);
    }
}

class BasicAuthMiddleware extends HttpAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'basic';
    public enabled = false;

    constructor(
        environment: any,
        userProvider: UserProviderInterface,
        userService: UserServiceInterface
    ) {
        super(environment, userProvider, userService);
    }

    public initialize(app: express.Express): void {
        let error = '';
        if (!this.environment.useBasicAuth) {
            error = 'Basic Auth is disabled.';
        }
        else {
            passport.use(new passportHttp.BasicStrategy((username, password, done) => {
                this.userService.repository.getByAuth(this.strategyId, username).then((user: BasicAuthUserModel) => {
                    if (!user) {
                        return done(null, false);
                    }
                    else {
                        if (this.userService.verifyPassword(password, user.passwordHash, user.passwordSalt)) {
                            this.userService.login(user).then(sessionToken => {
                                user.sessionToken = sessionToken;
                                return done(null, user);
                            }).catch(err => done(err));
                        }
                        else {
                            return done(null, false);
                        }
                    }
                }).catch(err => done(err));
            }));

            app.get('/auth/basic', passport.authenticate('basic'), (req, res) => {
                const user = req.user as BasicAuthUserModel;
                user.passwordHash = '';
                user.passwordSalt = '';
                res.json(req.user);
            });

            this.addAuthRoutes(app);
            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/basic', (req, res) => {
                throw new Error(error);
            });
        }
    }

    public isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const sessionId = req.headers['session_token'] as string;
        if (!sessionId) {
            res.status(401);
        }
        else {
            this.userService.repository.getUserBySession(sessionId).then(user => {
                if (user) {
                    const httpUser = user as BasicAuthUserModel;
                    const session = httpUser.sessions.find(x => x.sessionToken === sessionId);
                    if (!session || session.expires < Date.now()) {
                        this.userService.repository.clearSession(sessionId)
                            .then(() => res.status(410))
                            .catch(err => next(err));
                    }
                    else {
                        return next();
                    }
                }
                else {
                    res.status(401);
                }
            }).catch(err => next(err));
        }
    };
}
