import * as express from 'express';

import { UserProviderInterface } from '../providers/user.provider.interface';
import { UserServiceInterface } from '../services/user.service.interface';

export interface AuthMiddlewareInterface {
    initialize(app: express.Express): void;
}

export interface AuthFactory {
    create(environment: any, userProvider: UserProviderInterface, userService: UserServiceInterface): AuthMiddlewareInterface;
}
