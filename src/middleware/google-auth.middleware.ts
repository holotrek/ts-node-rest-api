import * as express from 'express';
import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth2';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';

export class GoogleAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserRepositoryInterface): AuthMiddlewareInterface {
        return new GoogleAuthMiddleware(environment, userProvider, userService);
    }
}

class GoogleAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'google';
    public enabled = false;

    constructor(
        private environment: any,
        private userProvider: UserProviderInterface,
        private userRepo: UserRepositoryInterface
    ) { }

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
            }, (accessToken, refreshToken, profile, done) => {
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
            app.get('/auth/google', passport.authenticate('google', {
                scope: [
                    'https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'
                ]
            }));
            app.get('/auth/google/callback', passport.authenticate('google', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                res.redirect(`${this.environment.clientAuthUrl}/auth/success/${req.user.authId}?accessToken=${req.user.accessToken}`);
            });

            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/google', (req, res) => {
                throw new Error(error);
            });
        }
    }
}
