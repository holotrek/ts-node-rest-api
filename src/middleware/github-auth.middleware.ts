import * as express from 'express';
import * as passport from 'passport';
import * as githubStrategy from 'passport-github2';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';

export class GithubAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserRepositoryInterface): AuthMiddlewareInterface {
        return new GithubAuthMiddleware(environment, userProvider, userService);
    }
}

class GithubAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'github';

    constructor(
        private environment: any,
        private userProvider: UserProviderInterface,
        private userRepo: UserRepositoryInterface
    ) { }

    public initialize(app: express.Express): void {
        let useAuth = false;
        let error = '';
        if (!this.environment.useGithubAuth) {
            error = 'Github Auth is disabled.';
        }
        else if (!this.environment.githubId || !this.environment.githubSecret) {
            error = 'Github Auth is configured incorrectly.';
        }
        else {
            passport.use(new githubStrategy.Strategy({
                clientID: this.environment.githubId,
                clientSecret: this.environment.githubSecret,
                callbackURL: `${this.environment.serverUrl}/auth/github/callback`,
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
            app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));
            app.get('/auth/github/callback', passport.authenticate('github', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                res.redirect(`${this.environment.clientAuthUrl}/auth/success/${req.user.authId}?accessToken=${req.user.accessToken}`);
            });

            useAuth = true;
        }

        if (!useAuth) {
            app.get('/auth/github', (req, res) => {
                throw new Error(error);
            });
        }
    }
}
