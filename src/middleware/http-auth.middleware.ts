import * as express from 'express';

import { OAuthUserModel, HttpAuthUserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthMiddlewareInterface } from './auth.middleware.interface';
import { UserServiceInterface } from '../services/user.service.interface';

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
                    user.passwordHash = '';
                    user.passwordSalt = '';
                    return res.json(user);
                }).catch(err => res.status(500).json({ error: err }));
            });

            app.get('/auth/logoff/:session', (req, res, next) => {
                this.userService.repository.clearSession(req.params.session).then(() => {
                    this.userProvider.setCurrentUser(null);
                    return res.json({ message: 'User logged off.'});
                }).catch(err => res.status(500).json({ error: err }));
            });

            HttpAuthMiddleware._authRolesAdded = true;
        }
    }
}
