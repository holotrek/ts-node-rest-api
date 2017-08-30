import * as mongoose from 'mongoose';

import { UserModel } from '../domain/user-model';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';

export class UserRepository implements UserRepositoryInterface {
    private static User: mongoose.Model<any>;

    constructor() {
        UserRepository.User = mongoose.model('Users');
    }

    getUsers(conditions: Object): Promise<UserModel[]> {
        return new Promise<UserModel[]>((resolve: any, reject: any) => {
            UserRepository.User.find(conditions, (err: any, user: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(user);
                }
            });
        });
    }

    getUser(id: string): Promise<UserModel> {
        return new Promise<UserModel>((resolve: any, reject: any) => {
            UserRepository.User.findById(id, (err: any, user: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(user);
                }
            });
        });
    }

    createUser(user: UserModel): Promise<UserModel> {
        return new Promise<any>((resolve: any, reject: any) => {
            const newUser = new UserRepository.User(user);
            newUser.save((err: any, userOut: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(userOut);
                }
            });
        });
    }

    getByAuthOrCreateUser(user: UserModel): Promise<UserModel> {
        return new Promise<any>((resolve: any, reject: any) => {
            this.getUsers({
                authId: user.authId,
                strategyId: user.strategyId
            }).then(users => {
                if (users.length) {
                    resolve(users[0]);
                }
                else {
                    this.createUser(user).then(created => {
                        resolve(created);
                    });
                }
            });
        });
    }
}
