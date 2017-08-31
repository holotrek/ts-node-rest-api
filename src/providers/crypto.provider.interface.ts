export interface CryptoProviderInterface {
    hashPassword(password: string, algorithm?: string): [string, string];
    verifyPassword(password: string, passwordHash: string, salt: string, algorithm?: string): boolean;
    encrypt(plaintext: string, algorithm?: string): string;
    decrypt(encrypted: string, algorithm?: string): string;
}
