import * as express from 'express';
import * as passport from 'passport';
import * as facebookStrategy from 'passport-facebook';

import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { OAuthMiddleware } from './oauth.middleware';

export class FacebookAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserRepositoryInterface): AuthMiddlewareInterface {
        return new FacebookAuthMiddleware(environment, userProvider, userService);
    }
}

class FacebookAuthMiddleware extends OAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'facebook';
    public enabled = false;

    constructor(
        environment: any,
        userProvider: UserProviderInterface,
        userRepo: UserRepositoryInterface
    ) {
        super(environment, userProvider, userRepo);
    }

    public initialize(app: express.Express): void {
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
            }, this.verify));

            app.get('/auth/facebook', passport.authenticate('facebook'));

            app.get('/auth/facebook/callback', passport.authenticate('facebook', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                res.cookie('auth_strategy', this.strategyId);
                res.cookie('auth_id', req.user.authId);
                res.cookie('auth_accessToken', req.user.accessToken);
                res.cookie('auth_refreshToken', req.user.refreshToken);
                res.redirect(`${this.environment.clientAuthUrl}/auth/success`);
            });

            const FacebookTokenStrategy = require('passport-facebook-token');
            passport.use(new FacebookTokenStrategy({
                clientID: this.environment.facebookId,
                clientSecret: this.environment.facebookSecret
            }, this.verify));

            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/facebook', (req, res) => {
                throw new Error(error);
            });
        }
    }

    public isAuthenticated = passport.authenticate('facebook-token');
}
