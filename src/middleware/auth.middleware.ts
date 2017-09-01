import * as express from 'express';
import * as passport from 'passport';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserServiceInterface } from '../services/user.service.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';

export class AuthMiddleware implements AuthMiddlewareInterface {
    private _middleware: AuthMiddlewareInterface[];
    public readonly strategyId = '';
    public readonly enabled = true;

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

        passport.serializeUser((user: UserModel | undefined, done) => {
            done(null, user ? user._id : '');
        });

        passport.deserializeUser((id: string, done) => {
            if (id) {
                this.userService.repository.getUser(id).then(user => {
                    done(null, user);
                }).catch(err => done(err));
            }
            else {
                done(`invalid auth id: ${id}`);
            }
        });
    }

    public getEnabledAuthStrategies(): string[] {
        return this._middleware.filter(x => x.enabled).map(x => x.strategyId);
    }

    public isAuthenticated = (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const strategy = req.headers['strategy'];
        const middleware = this._middleware.find(x => x.strategyId === strategy);
        if (middleware) {
            middleware.isAuthenticated(req, res, next);
        }
        else {
            res.status(401);
        }
    }
}
