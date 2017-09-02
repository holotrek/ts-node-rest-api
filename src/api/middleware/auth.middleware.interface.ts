import * as express from 'express';

import { UserProviderInterface } from '../../providers/user.provider.interface';
import { UserServiceInterface } from '../../services/user.service.interface';

export interface AuthMiddlewareInterface {
    strategyId: string;
    enabled: boolean;
    initialize(app: express.Express): void;
    isAuthenticated: express.Handler;
}

export interface AuthFactory {
    create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface;
}
