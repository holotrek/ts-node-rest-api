import * as express from 'express';
import * as passport from 'passport';
import * as passportHttp from 'passport-http';

import { HttpAuthUserModel } from '../../domain/user-model';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserServiceInterface } from '../../services/user.service.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { HttpAuthMiddleware } from './http-auth.middleware';

export class DigestAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface {
        return new DigestAuthMiddleware(environment, userProvider, userService);
    }
}

class DigestAuthMiddleware extends HttpAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'digest';
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
        if (!this.environment.useDigestAuth) {
            error = 'Digest Auth is disabled.';
        }
        else {
            passport.use(new passportHttp.DigestStrategy({ qop: 'auth' }, (username, done) => {
                this.userService.repository.getByAuth(this.strategyId, username).then((user: HttpAuthUserModel) => {
                    if (!user) {
                        return done(null, false);
                    }
                    else {
                        this.userService.login(user).then(sessionToken => {
                            user.sessionToken = sessionToken;
                            return done(null, user, this.userService.decryptPassword(user));
                        }).catch(err => done(err));
                    }
                }).catch(err => done(err));
            }, (params, done) => {
                done(null, true);
            }));

            app.get('/auth/digest', passport.authenticate('digest'), (req, res) => {
                res.json(req.user);
            });

            this.addAuthRoutes(app);
            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/digest', (req, res) => {
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
                    const httpUser = user as HttpAuthUserModel;
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
