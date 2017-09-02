import { inject, injectable } from 'inversify';
import * as uuid4 from 'uuid/v4';

import { BasicAuthUserModel, DigestAuthUserModel, HttpAuthUserModel, UserModel } from '../domain/user-model';
import { TYPES } from '../api/ioc.types';
import { CryptoProviderInterface } from '../providers/crypto.provider.interface';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';
import { UserServiceInterface } from './user.service.interface';

@injectable()
export class UserServiceSettings {
    constructor(
        @inject(TYPES.sessionTimeout) public sessionTimeout: number
    ) { }
}

@injectable()
export class UserService implements UserServiceInterface {
    constructor(
        @inject(TYPES.UserRepository) public repository: UserRepositoryInterface,
        @inject(TYPES.CryptoProvider) private cryptoProvider: CryptoProviderInterface,
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
                if (!strategyId) {
                    return Promise.reject('Registration requres an authentication strategy.');
                }

                let user = new HttpAuthUserModel();
                switch (strategyId) {
                    case 'basic':
                        user = new BasicAuthUserModel();
                        break;
                    case 'digest':
                        user = new DigestAuthUserModel();
                        break;
                    default:
                        break;
                }

                this.setPassword(user, pass);
                user.authId = authId;
                user.name = request.body.displayName || authId;
                user.strategyId = strategyId;
                user.created = Date.now();
                user.createdBy = user.name;
                return this.repository.createUser(user);
            }
        });
    }

    public verifyPassword(password: string, passwordHash: string, salt: string, algorithm?: string): boolean {
        return this.cryptoProvider.verifyPassword(password, passwordHash, salt, algorithm);
    }

    public login(user: HttpAuthUserModel): Promise<string> {
        const sess = uuid4();
        user.sessions.push({
            sessionToken: sess,
            expires: Date.now() + this.settings.sessionTimeout
        });
        return this.repository.updateUser(user._id, user).then(() => sess);
    }

    public setPassword(user: HttpAuthUserModel, password: string): void {
        if (user instanceof BasicAuthUserModel) {
            const hashes = this.cryptoProvider.hashPassword(password);
            (user as BasicAuthUserModel).passwordSalt = hashes[0];
            (user as BasicAuthUserModel).passwordHash = hashes[1];
        }
        else if (user instanceof DigestAuthUserModel) {
            (user as DigestAuthUserModel).encryptedPassword = this.cryptoProvider.encrypt(password);
        }
    }

    public clearPassword(user: HttpAuthUserModel): void {
        if (user instanceof BasicAuthUserModel) {
            (user as BasicAuthUserModel).passwordSalt = '';
            (user as BasicAuthUserModel).passwordHash = '';
        }
        else if (user instanceof DigestAuthUserModel) {
            (user as DigestAuthUserModel).encryptedPassword = '';
        }
    }

    public decryptPassword(user: HttpAuthUserModel): string {
        return this.cryptoProvider.decrypt((user as DigestAuthUserModel).encryptedPassword);
    }
}
