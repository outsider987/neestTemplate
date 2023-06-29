import * as crypto from 'crypto';

const key = 'vOVE45asssdmpNWjRRI123FDSx01lwHz'; // CONSTANT & Must be 256 bits (32 characters)
const algorithm = 'aes-256-ctr';
// const ENCRYPTION_KEY = process.env.SECRET_KEY;
const IV_LENGTH = 16; // For AES, this is always 16

const decrypt = (password) => {
    try {
        const textParts = password.split(':');
        const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(textParts[0], 'hex'));
        const decrypted = Buffer.concat([decipher.update(Buffer.from(textParts[1], 'hex')), decipher.final()]);
        return decrypted.toString();
    } catch (err) {
        throw new Error(err);
    }
};

/**
 * encrypt password
 * @param {*} password
 * @returns {string} result is different, if restarted server. HOWEVER, decrypted result is same
 * e.g., f97c82cd8a4b01c5beeb18a6dd28e379:964e03 = 123
 * e.g., 140cfa6f19b5c08317ac5dbf80841f57:785d8b = 123
 */
const encrypt = (password) => {
    try {
        const iv = crypto.randomBytes(IV_LENGTH);
        const cipher = crypto.createCipheriv(algorithm, key, iv);
        const encrypted = Buffer.concat([cipher.update(password), cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    } catch (err) {
        throw new Error(err);
    }
};

export default {
    encrypt,
    decrypt,
};

// hash function for S3 path
export function hashS3Path(S3Path: string): string {
    const seed = 'vOVE45asssdmpNWjRRI123FDSx01lwHz';
    const hash = crypto.createHash('sha256');
    hash.update(seed + S3Path + seed);
    return `${S3Path}_${hash.digest('hex')}`;
}
