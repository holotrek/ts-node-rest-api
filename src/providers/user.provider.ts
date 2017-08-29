import { UserProviderInterface } from './user.provider.interface';

export class UserProvider implements UserProviderInterface {
    private _userName: string;

    public get userName(): string {
        return this._userName;
    }

    public get isAuthenticated(): boolean {
        return !!this._userName;
    }

    public setCurrentUser(userName?: string): void {
        this._userName = userName || '';
    }
}
