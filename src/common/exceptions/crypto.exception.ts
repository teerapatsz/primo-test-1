import { HttpStatus } from '@nestjs/common';
import { BaseException } from './base.exception';
import { ErrorCode } from '../constants/error-code';

export class CryptoException {
    static AesEncryption(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.AES_ENCRYPTION_FAILED, HttpStatus.BAD_REQUEST, lang);
    }

    static AesDecryption(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.AES_DECRYPTION_FAILED, HttpStatus.BAD_REQUEST, lang);
    }

    static RsaEncryption(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.RSA_ENCRYPTION_FAILED, HttpStatus.BAD_REQUEST, lang);
    }

    static RsaDecryption(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.RSA_DECRYPTION_FAILED, HttpStatus.BAD_REQUEST, lang);
    }

    static InvalidEncryptedData(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.INVALID_ENCRYPTED_DATA, HttpStatus.BAD_REQUEST, lang);
    }

    static KeyLoadFailed(lang?: 'en' | 'th') {
        return new BaseException(ErrorCode.KEY_LOAD_FAILED, HttpStatus.INTERNAL_SERVER_ERROR, lang);
    }
}
