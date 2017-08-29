export interface UserProviderInterface {
    userName: string;
    isAuthenticated: boolean;
    setCurrentUser(userName?: string): void;
}
