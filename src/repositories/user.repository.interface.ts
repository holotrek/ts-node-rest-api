import { UserModel } from '../domain/user-model';

export interface UserRepositoryInterface {
    getUsers(conditions: Object): Promise<UserModel[]>;
    getUser(id: string): Promise<UserModel>;
    createUser(user: UserModel): Promise<UserModel>;
    getByAuthOrCreateUser(user: UserModel): Promise<UserModel>;
}
