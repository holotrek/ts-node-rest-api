import * as express from 'express';
import * as passport from 'passport';
import * as githubStrategy from 'passport-github2';

import { OAuthUserModel } from '../../domain/user-model';
import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserRepositoryInterface } from '../../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { OAuthMiddleware } from './oauth.middleware';
import { UserServiceInterface } from '../../services/user.service.interface';

export class GithubAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface {
        return new GithubAuthMiddleware(environment, userProvider, userService);
    }
}

class GithubAuthMiddleware extends OAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'github';
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
            }, this.verify));

            app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

            app.get('/auth/github/callback', passport.authenticate('github', {
                failureRedirect: `${this.environment.clientAuthUrl}/auth/failure`,
            }), (req, res) => {
                const user = req.user as OAuthUserModel;
                res.redirect(`${this.environment.clientAuthUrl}/auth/success?strategy=${this.strategyId}&access_token=${user.accessToken}&refresh_token=${user.refreshToken || ''}`);
            });

            const GithubTokenStrategy = require('passport-github-token');
            passport.use(new GithubTokenStrategy({
                clientID: this.environment.githubId,
                clientSecret: this.environment.githubSecret
            }, this.verify));

            this.enabled = true;
        }

        if (!this.enabled) {
            app.get('/auth/github', (req, res) => {
                throw new Error(error);
            });
        }
    }

    public isAuthenticated = passport.authenticate('github-token', { session: false });
}
