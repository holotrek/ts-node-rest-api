import * as express from 'express';

import { BasicAuthUserModel, DigestAuthUserModel, HttpAuthUserModel } from '../../domain/user-model';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserServiceInterface } from '../../services/user.service.interface';
import { AuthMiddlewareInterface } from './auth.middleware.interface';

export abstract class HttpAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId: string = '';
    public enabled = false;
    private static _authRolesAdded = false;

    constructor(
        protected environment: any,
        protected userProvider: UserProviderInterface,
        protected userService: UserServiceInterface
    ) {
    }

    abstract initialize(app: express.Express): void;

    abstract isAuthenticated: express.Handler;

    protected addAuthRoutes(app: express.Express) {
        if (!HttpAuthMiddleware._authRolesAdded) {
            app.post('/auth/register', (req, res, next) => {
                this.userService.registerUser(req).then((user: HttpAuthUserModel) => {
                    this.userService.clearPassword(user);
                    return res.json(user);
                }).catch(err => next(err));
            });

            app.get('/auth/logoff/:session', (req, res, next) => {
                this.userService.repository.clearSession(req.params.session).then(() => {
                    this.userProvider.setCurrentUser(null);
                    return res.json({ message: 'User logged off.'});
                }).catch(err => next(err));
            });

            HttpAuthMiddleware._authRolesAdded = true;
        }
    }
}
