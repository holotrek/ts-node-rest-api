import { UserModel } from '../domain/user-model';

export interface UserServiceInterface {
    findOrCreate(conditions: Object): Promise<UserModel>;
}
