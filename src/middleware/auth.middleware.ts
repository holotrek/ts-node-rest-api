import * as express from 'express';
import * as passport from 'passport';
import * as googleStrategy from 'passport-google-oauth2';

import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserServiceInterface } from '../services/user.service.interface';

export class AuthMiddleware {
    constructor(
        private environment: any,
        private userProvider: UserProviderInterface,
        private userService: UserServiceInterface
    ) { }

    public initialize(app: express.Express) {
        if (this.environment.useGoogleAuth && !!this.environment.googleId && !!this.environment.googleSecret) {
            passport.use(new googleStrategy.Strategy({
                    clientID: (process.env.GOOGLE_CLIENT_ID as string),
                    clientSecret: (process.env.GOOGLE_CLIENT_SECRET as string),
                    callbackURL: `${this.environment.serverUrl}/auth/google/callback`,
                    passReqToCallback: true
                },
                (request, accessToken, refreshToken, profile, done) => {
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
        }
    }
}
