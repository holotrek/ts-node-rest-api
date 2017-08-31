import * as express from 'express';
import * as passport from 'passport';
import * as githubStrategy from 'passport-github2';

import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { AuthFactory, AuthMiddlewareInterface } from './auth.middleware.interface';
import { OAuthMiddleware } from './oauth.middleware';

export class GithubAuthFactory implements AuthFactory {
    public create(environment: any, userProvider: UserProviderInterface, userService: UserRepositoryInterface): AuthMiddlewareInterface {
        return new GithubAuthMiddleware(environment, userProvider, userService);
    }
}

class GithubAuthMiddleware extends OAuthMiddleware implements AuthMiddlewareInterface {
    public readonly strategyId = 'github';
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
                res.cookie('auth_strategy', this.strategyId);
                res.cookie('auth_id', req.user.authId);
                res.cookie('auth_accessToken', req.user.accessToken);
                res.cookie('auth_refreshToken', req.user.refreshToken);
                res.redirect(`${this.environment.clientAuthUrl}/auth/success`);
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

    public isAuthenticated = passport.authenticate('github-token');
}
