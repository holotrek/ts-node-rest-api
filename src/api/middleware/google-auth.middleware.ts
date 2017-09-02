import * as express from 'express';
import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth2';

import { OAuthUserModel } from '../../domain/user-model';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserRepositoryInterface } from '../../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { OAuthMiddleware } from './oauth.middleware';
import { UserServiceInterface } from '../../services/user.service.interface';

export class GoogleAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface {
        return new GoogleAuthMiddleware(environment, userProvider, userService);
    }
}

class GoogleAuthMiddleware extends OAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'google';
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
        if (!this.environment.useGoogleAuth) {
            error = 'Google Auth is disabled.';
        }
        else if (!this.environment.googleId || !this.environment.googleSecret) {
            error = 'Google Auth is configured incorrectly.';
        }
        else {
            passport.use(new googleStrategy.Strategy({
                clientID: this.environment.googleId,
                clientSecret: this.environment.googleSecret,
                callbackURL: `${this.environment.serverUrl}/auth/google/callback`,
            }, this.verify));

            app.get('/auth/google', passport.authenticate('google', {
                scope: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]
            }));

            app.get('/auth/google/callback', passport.authenticate('google', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                const user = req.user as OAuthUserModel;
                res.redirect(`${this.environment.clientAuthUrl}/auth/success?strategy=${this.strategyId}&access_token=${user.accessToken}&refresh_token=${user.refreshToken || ''}`);
            });

            const GoogleTokenStrategy = require('passport-google-token').Strategy;
            passport.use(new GoogleTokenStrategy({
                clientID: this.environment.googleId,
                clientSecret: this.environment.googleSecret
            }, this.verify));

            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/google', (req, res) => {
                throw new Error(error);
            });
        }
    }

    public isAuthenticated = passport.authenticate('google-token', { session: false });
}
