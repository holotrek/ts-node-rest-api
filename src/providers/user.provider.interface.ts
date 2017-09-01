export interface UserProviderInterface {
    userName: string;
    isAuthenticated: boolean;
    setCurrentUser(user?: any): void;
}
