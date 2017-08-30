import * as express from 'express';

import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserServiceInterface } from '../services/user.service.interface';
import { AuthMiddlewareInterface, AuthFactory } from './auth.middleware.interface';

export class AuthMiddleware implements AuthMiddlewareInterface {
    private _middleware: AuthMiddlewareInterface[];

    constructor(
        private middlewareUsed: AuthFactory[],
        private environment: any,
        private userProvider: UserProviderInterface,
        private userService: UserServiceInterface
    ) {
        this._middleware = [];
        for (const c of middlewareUsed) {
            const m = c.create(environment, userProvider, userService);
            this._middleware.push(m);
        }
    }

    public initialize(app: express.Express): void {
        for (const m of this._middleware) {
            m.initialize(app);
        }
    }
}
