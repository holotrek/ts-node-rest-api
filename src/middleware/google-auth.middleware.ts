import * as express from 'express';
import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth2';

import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserServiceInterface } from '../services/user.service.interface';
import { AuthMiddlewareInterface, AuthFactory } from './auth.middleware.interface';

export class GoogleAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface {
        return new GoogleAuthMiddleware(environment, userProvider, userService);
    }
}

class GoogleAuthMiddleware implements AuthMiddlewareInterface {
    constructor(
        private environment: any,
        private userProvider: UserProviderInterface,
        private userService: UserServiceInterface
    ) { }

    public initialize(app: express.Express): void {
        let useAuth = false;
        let error = '';
        if (!this.environment.useGoogleAuth) {
            error = 'Google Auth is disabled.';
        }
        else if (!this.environment.googleId || !this.environment.googleSecret) {
            error = 'Google Auth is configured incorrectly.';
        }
        else {
            passport.use(new googleStrategy.Strategy({
                    clientID: (process.env.GOOGLE_CLIENT_ID as string),
                    clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string),
                    callbackURL: `${this.environment.serverUrl}/auth/google/callback`,
                    passReqToCallback: true
                },
                (request, accessToken, refreshToken, profile, done) => {
                    console.log(profile);
                    this.userService.findOrCreate({ googleId: profile.id })
                        .then(user => {
                            this.userProvider.setCurrentUser(user);
                            done('', user);
                        })
                        .catch(err => {
                            this.userProvider.setCurrentUser();
                            done(err)
                        });
                }
            ));
            app.get('/auth/google',
                passport.authenticate('google', {
                    scope: [
                        'https://www.googleapis.com/auth/plus.login',
                        'https://www.googleapis.com/auth/plus.profile.emails.read'
                    ]
                }
            ));
            app.get('/auth/google/callback',
                passport.authenticate('google', {
                    successRedirect: '/auth/google/success',
                    failureRedirect: '/auth/google/failure'
            }));
            app.get('/auth/google/success', (req, res) => {
                console.log(req);
                res.redirect(`${this.environment.clientAuthUrl}/auth/success`);
            });
            app.get('/auth/google/success', (req, res) => {
                res.redirect(`${this.environment.clientAuthUrl}/auth/failure`);
            });

            useAuth = true;
        }

        if (!useAuth) {
            app.get('/auth/google', (req, res) => {
                throw new Error(error);
            });
        }
    }
}
