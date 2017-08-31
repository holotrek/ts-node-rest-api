import * as crypto from 'crypto';
import { HashProviderInterface } from './hash.provider.interface';

export class CryptoHashProvider implements HashProviderInterface {
    public hashPassword(password: string, algorithm: string = 'sha512'): [string, string] {
        const salt = this.genRandomString(8);
        const hash = crypto.createHmac(algorithm, salt);
        hash.update(password);
        const passwordHash = hash.digest('hex');
        return [salt, passwordHash];
    }

    public verifyPassword(password: string, passwordHash: string, salt: string, algorithm: string = 'sha512'): boolean {
        const hash = crypto.createHmac(algorithm, salt);
        hash.update(password);
        return hash.digest('hex') === passwordHash;
    }

    private genRandomString(length: number) {
        return crypto.randomBytes(Math.ceil(length / 2))
                .toString('hex') /** convert to hexadecimal format */
                .slice(0, length);   /** return required number of characters */
    }
}
