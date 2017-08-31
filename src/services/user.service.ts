import * as uuid4 from 'uuid/v4';

import { HttpAuthUserModel, UserModel } from '../domain/user-model';
import { HashProviderInterface } from '../providers/hash.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { UserServiceInterface } from './user.service.interface';

export class UserServiceSettings {
    constructor(
        public sessionTimeout: number
    ) { }
}

export class UserService implements UserServiceInterface {
    constructor(
        public repository: UserRepositoryInterface,
        private hashProvider: HashProviderInterface,
        private settings: UserServiceSettings
    ) {
    }

    public registerUser(request: any): Promise<UserModel> {
        if (!request.body) {
            return Promise.reject('Registration requires a request body.');
        }

        const authId = request.body.authId;
        if (!authId) {
            return Promise.reject('Registration requres a username.');
        }

        return this.repository.getUsers({ authId: authId }).then(existingUsers => {
            if (existingUsers.length) {
                return Promise.reject(`User ${authId} is already registered.`);
            }
            else {
                const pass = request.body.password;
                if (!pass) {
                    return Promise.reject('Registration requres a password.');
                }

                const strategyId = request.body.strategyId;
                if (!pass) {
                    return Promise.reject('Registration requres an authentication strategy.');
                }

                const hashes = this.hashProvider.hashPassword(pass);
                const user = new HttpAuthUserModel();
                user.authId = authId;
                user.name = request.body.displayName || authId;
                user.passwordSalt = hashes[0];
                user.passwordHash = hashes[1];
                user.strategyId = request.body.strategyId;
                user.created = Date.now();
                user.createdBy = user.name;
                return this.repository.createUser(user);
            }
        });
    }

    public verifyPassword(password: string, passwordHash: string, salt: string, algorithm?: string): boolean {
        return this.hashProvider.verifyPassword(password, passwordHash, salt, algorithm);
    }

    public login(user: HttpAuthUserModel): Promise<string> {
        const sess = uuid4();
        user.sessions.push({
            sessionToken: sess,
            expires: Date.now() + this.settings.sessionTimeout
        });
        return this.repository.updateUser(user._id, user).then(() => sess);
    }
}
