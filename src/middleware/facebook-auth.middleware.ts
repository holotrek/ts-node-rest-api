import * as express from 'express';
import * as passport from 'passport';
import * as facebookStrategy from 'passport-facebook';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';

export class FacebookAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserRepositoryInterface): AuthMiddlewareInterface {
        return new FacebookAuthMiddleware(environment, userProvider, userService);
    }
}

class FacebookAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'facebook';

    constructor(
        private environment: any,
        private userProvider: UserProviderInterface,
        private userRepo: UserRepositoryInterface
    ) { }

    public initialize(app: express.Express): void {
        let useAuth = false;
        let error = '';
        if (!this.environment.useFacebookAuth) {
            error = 'Facebook Auth is disabled.';
        }
        else if (!this.environment.facebookId || !this.environment.facebookSecret) {
            error = 'Facebook Auth is configured incorrectly.';
        }
        else {
            passport.use(new facebookStrategy.Strategy({
                clientID: this.environment.facebookId,
                clientSecret: this.environment.facebookSecret,
                callbackURL: `${this.environment.serverUrl}/auth/facebook/callback`,
            }, (accessToken, refreshToken, profile, done) => {
                console.log(profile);
                const user = new UserModel();
                user.strategyId = this.strategyId;
                user.authId = profile.id;
                user.name = profile.displayName;
                user.accessToken = accessToken;
                user.refreshToken = refreshToken;
                user.created = Date.now();
                user.createdBy = user.name;
                this.userRepo.getByAuthOrCreateUser(user).then(created => {
                    done(null, created);
                });
            }));
            app.get('/auth/facebook', passport.authenticate('facebook'));
            app.get('/auth/facebook/callback', passport.authenticate('facebook', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                res.redirect(`${this.environment.clientAuthUrl}/auth/success/${req.user.authId}?accessToken=${req.user.accessToken}`);
            });

            useAuth = true;
        }

        if (!useAuth) {
            app.get('/auth/facebook', (req, res) => {
                throw new Error(error);
            });
        }
    }
}
