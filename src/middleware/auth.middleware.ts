import * as express from 'express';
import * as passport from 'passport';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';

export class AuthMiddleware implements AuthMiddlewareInterface {
    private _middleware: AuthMiddlewareInterface[];
    public readonly strategyId = '';

    constructor(
        private middlewareUsed: AuthFactory[],
        private environment: any,
        private userProvider: UserProviderInterface,
        private userRepo: UserRepositoryInterface
    ) {
        this._middleware = [];
        for (const c of middlewareUsed) {
            const m = c.create(environment, userProvider, userRepo);
            this._middleware.push(m);
        }
    }

    public initialize(app: express.Express): void {
        for (const m of this._middleware) {
            m.initialize(app);
        }

        passport.serializeUser((user: UserModel | undefined, done) => {
            done(null, user ? user._id : '');
        });

        passport.deserializeUser((id: string, done) => {
            if (id) {
                this.userRepo.getUser(id).then(user => {
                    done(null, user);
                });
            }
            else {
                done(`invalid auth id: ${id}`);
            }
        });
    }
}
