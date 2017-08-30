import { UserModel } from '../domain/user-model';
import { UserProviderInterface } from './user.provider.interface';

export class UserProvider implements UserProviderInterface {
    private _user: UserModel;

    public get userName(): string {
        return this._user.name;
    }

    public get isAuthenticated(): boolean {
        return !!this._user;
    }

    public setCurrentUser(user?: any): void {
        this._user = user || null;
    }
}
