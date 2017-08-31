import { UserModel } from '../domain/user-model';

export interface UserRepositoryInterface {
    getUsers(conditions: Object): Promise<UserModel[]>;
    getUser(id: string): Promise<UserModel>;
    createUser(user: UserModel): Promise<UserModel>;
    updateUser(id: string, user: UserModel): Promise<UserModel>;
    getUserBySession(sessionId: string): Promise<UserModel>;
    getByAuth(strategyId: string, authId: string): Promise<UserModel>;
    getByAuthOrCreateUser(user: UserModel): Promise<UserModel>;
    clearSession(sessionId: string): Promise<void>;
}
