import * as express from 'express';

import { OAuthUserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthMiddlewareInterface } from './auth.middleware.interface';
import { UserServiceInterface } from '../services/user.service.interface';

export abstract class OAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId: string = '';
    public enabled = false;

    constructor(
        protected environment: any,
        protected userProvider: UserProviderInterface,
        protected userService: UserServiceInterface
    ) {
    }

    abstract initialize(app: express.Express): void;

    abstract isAuthenticated: express.Handler;

    protected verify = (accessToken: string, refreshToken: string, profile: any, done: (error: any, user?: any, info?: any) => void) => {
        const user = new OAuthUserModel();
        user.strategyId = this.strategyId;
        user.authId = profile.id;
        user.name = profile.displayName;
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        user.created = Date.now();
        user.createdBy = user.name;
        this.userService.repository.getByAuthOrCreateUser(user).then(created => {
            done(null, created);
        });
    }
}
