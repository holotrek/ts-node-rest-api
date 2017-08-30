import { UserModel } from '../domain/user-model';
import { UserServiceInterface } from './user.service.interface';

export class UserService implements UserServiceInterface {
    public findOrCreate(conditions: Object): Promise<UserModel> {
        // TODO: get from repository
        console.log(conditions);
        return Promise.resolve(new UserModel());
    }
}
