import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { CryptoException, BaseException } from '../../common/exceptions';

@Injectable()
export class CryptoLogicService {
    private privateKey: string;
    private publicKey: string;
    private readonly AES_ALGORITHM = 'aes-256-cbc';
    private readonly AES_IV_LENGTH = 16;

    constructor() {
        try {
            const privateKeyPath = path.join(process.cwd(), 'src', 'keys', 'private.pem');
            const publicKeyPath = path.join(process.cwd(), 'src', 'keys', 'public.pem');

            this.privateKey = fs.readFileSync(privateKeyPath, 'utf8');
            this.publicKey = fs.readFileSync(publicKeyPath, 'utf8');
        } catch (e) {
            console.error("Failed to load crypto keys:", e.message);
            throw CryptoException.KeyLoadFailed();
        }
    }

    public generateAesKeyAndIV(): { key: string, iv: string } {
        const key = crypto.randomBytes(32).toString('hex');
        const iv = crypto.randomBytes(this.AES_IV_LENGTH).toString('hex');
        return { key, iv };
    }

    public encryptAes(payload: string, key: string, iv: string): string {
        try {
            const keyBuffer = Buffer.from(key, 'hex');
            const ivBuffer = Buffer.from(iv, 'hex');
            const cipher = crypto.createCipheriv(this.AES_ALGORITHM, keyBuffer, ivBuffer);
            let encrypted = cipher.update(payload, 'utf8', 'base64');
            encrypted += cipher.final('base64');

            return `${iv}:${encrypted}`;
        } catch (error) {
            console.error('AES Encryption failed:', error);
            throw CryptoException.AesEncryption();
        }
    }

    public decryptAes(encryptedData: string, key: string): string {
        try {
            const parts = encryptedData.split(':');
            if (parts.length !== 2) {
                throw CryptoException.InvalidEncryptedData();
            }
            const [ivHex, dataBase64] = parts;
            const keyBuffer = Buffer.from(key, 'hex');
            const ivBuffer = Buffer.from(ivHex, 'hex');

            const decipher = crypto.createDecipheriv(this.AES_ALGORITHM, keyBuffer, ivBuffer);
            let decrypted = decipher.update(dataBase64, 'base64', 'utf8');
            decrypted += decipher.final('utf8');
            return decrypted;
        } catch (error) {
            console.error('AES Decryption failed:', error);
            if (error instanceof BaseException) {
                throw error;
            }
            throw CryptoException.AesDecryption();
        }
    }

    public encryptAesKeyRsa(key: string): string {
        try {
            const encryptedKey = crypto.privateEncrypt(
                {
                    key: this.privateKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(key, 'hex')
            );
            return encryptedKey.toString('base64');
        } catch (error) {
            console.error('RSA Encryption failed:', error);
            throw CryptoException.RsaEncryption();
        }
    }

    public decryptAesKeyRsa(encryptedKey: string): string {
        try {
            const decryptedKey = crypto.publicDecrypt(
                {
                    key: this.publicKey,
                    padding: crypto.constants.RSA_PKCS1_PADDING,
                },
                Buffer.from(encryptedKey, 'base64')
            );
            return decryptedKey.toString('hex');
        } catch (error) {
            console.error('RSA Decryption failed:', error);
            throw CryptoException.RsaDecryption();
        }
    }
}