import * as mongoose from 'mongoose';

import { UserModel, HttpAuthUserModel } from '../domain/user-model';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';

export class UserRepository implements UserRepositoryInterface {
    private static User: mongoose.Model<any>;

    constructor() {
        UserRepository.User = mongoose.model('Users');
    }

    public getUsers(conditions: Object): Promise<UserModel[]> {
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

    public getUser(id: string): Promise<UserModel> {
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

    public createUser(user: UserModel): Promise<UserModel> {
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

    public updateUser(id: string, user: UserModel): Promise<UserModel> {
        return new Promise<UserModel>((resolve: any, reject: any) => {
            UserRepository.User.findOneAndUpdate({ _id: id }, user, { new: true }, (err: any, userOut: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(userOut);
                }
            });
        });
    }

    public getByAuth(strategyId: string, authId: string): Promise<UserModel> {
        return new Promise<any>((resolve: any, reject: any) => {
            this.getUsers({
                authId: authId,
                strategyId: strategyId
            }).then(users => {
                if (users && users.length) {
                    resolve(users[0]);
                }
                else {
                    resolve(null);
                }
            });
        });
    }

    public getByAuthOrCreateUser(user: UserModel): Promise<UserModel> {
        return new Promise<any>((resolve: any, reject: any) => {
            this.getByAuth(user.strategyId, user.authId).then(userOut => {
                if (userOut) {
                    resolve(userOut);
                }
                else {
                    this.createUser(user).then(created => {
                        resolve(created);
                    });
                }
            });
        });
    }

    public getUserBySession(sessionId: string): Promise<HttpAuthUserModel> {
        return new Promise<HttpAuthUserModel>((resolve: any, reject: any) => {
            UserRepository.User.findOne({
                'sessions.sessionToken': sessionId
            }, (err: any, user: any) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(user);
                }
            });
        });
    }

    public clearSession(sessionId: string): Promise<void> {
        return this.getUserBySession(sessionId).then(user => {
            const idx = user.sessions.findIndex(x => x.sessionToken === sessionId);
            if (idx > -1) {
                user.sessions.splice(idx, 1);
                this.updateUser(user._id, user);
            }
        });
    }
}
