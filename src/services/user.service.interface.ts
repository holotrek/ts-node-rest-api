import { HttpAuthUserModel, UserModel } from '../domain/user-model';
import { UserRepositoryInterface } from '../repositories/user.repository.interface';

export interface UserServiceInterface {
    repository: UserRepositoryInterface;
    registerUser(request: any): Promise<UserModel>;
    verifyPassword(password: string, passwordHash: string, salt: string, algorithm?: string): boolean;
    login(user: HttpAuthUserModel): Promise<string>;
}
