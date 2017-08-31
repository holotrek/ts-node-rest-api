export interface HashProviderInterface {
    hashPassword(password: string, algorithm?: string): [string, string];
    verifyPassword(password: string, passwordHash: string, salt: string, algorithm?: string): boolean;
}
