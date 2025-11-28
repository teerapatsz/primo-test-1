export enum ErrorCode {
    // Validation Errors (4xxx)
    PAYLOAD_REQUIRED = '4001',
    PAYLOAD_LENGTH_INVALID = '4002',
    PAYLOAD_TYPE_INVALID = '4003',
    DATA1_REQUIRED = '4004',
    DATA2_REQUIRED = '4005',

    // Crypto Errors (5xxx)
    AES_ENCRYPTION_FAILED = '5001',
    AES_DECRYPTION_FAILED = '5002',
    RSA_ENCRYPTION_FAILED = '5003',
    RSA_DECRYPTION_FAILED = '5004',
    INVALID_ENCRYPTED_DATA = '5005',
    KEY_LOAD_FAILED = '5006',

    // General Errors (9xxx)
    INTERNAL_SERVER_ERROR = '5000',
}

// Error messages by code and language
export const ERROR_MESSAGES: Record<ErrorCode, { en: string; th: string }> = {
    // Validation Errors
    [ErrorCode.PAYLOAD_REQUIRED]: {
        en: 'Payload is required',
        th: 'กรุณาระบุข้อมูล Payload'
    },
    [ErrorCode.PAYLOAD_LENGTH_INVALID]: {
        en: 'Payload must be between 0 and 2000 characters',
        th: 'Payload ต้องมีความยาวระหว่าง 0 ถึง 2000 ตัวอักษร'
    },
    [ErrorCode.PAYLOAD_TYPE_INVALID]: {
        en: 'Payload must be a string',
        th: 'Payload ต้องเป็นข้อความ'
    },
    [ErrorCode.DATA1_REQUIRED]: {
        en: 'data1 should not be empty',
        th: 'กรุณาระบุข้อมูล data1'
    },
    [ErrorCode.DATA2_REQUIRED]: {
        en: 'data2 should not be empty',
        th: 'กรุณาระบุข้อมูล data2'
    },

    // Crypto Errors
    [ErrorCode.AES_ENCRYPTION_FAILED]: {
        en: 'AES Encryption failed',
        th: 'การเข้ารหัส AES ล้มเหลว'
    },
    [ErrorCode.AES_DECRYPTION_FAILED]: {
        en: 'AES Decryption failed',
        th: 'การถอดรหัส AES ล้มเหลว'
    },
    [ErrorCode.RSA_ENCRYPTION_FAILED]: {
        en: 'RSA Encryption failed',
        th: 'การเข้ารหัส RSA ล้มเหลว'
    },
    [ErrorCode.RSA_DECRYPTION_FAILED]: {
        en: 'RSA Decryption failed',
        th: 'การถอดรหัส RSA ล้มเหลว'
    },
    [ErrorCode.INVALID_ENCRYPTED_DATA]: {
        en: 'Invalid encrypted data format',
        th: 'รูปแบบข้อมูลที่เข้ารหัสไม่ถูกต้อง'
    },
    [ErrorCode.KEY_LOAD_FAILED]: {
        en: 'Failed to load crypto keys',
        th: 'ไม่สามารถโหลด crypto keys ได้'
    },

    // General Errors
    [ErrorCode.INTERNAL_SERVER_ERROR]: {
        en: 'Internal server error',
        th: 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    },
};

// Validation error map for ValidationFilter
export const VALIDATION_ERROR_MAP: Record<string, ErrorCode> = {
    'Payload is required': ErrorCode.PAYLOAD_REQUIRED,
    'Payload must be between 0 and 2000 characters': ErrorCode.PAYLOAD_LENGTH_INVALID,
    'Payload must be a string': ErrorCode.PAYLOAD_TYPE_INVALID,
    'data1 should not be empty': ErrorCode.DATA1_REQUIRED,
    'data2 should not be empty': ErrorCode.DATA2_REQUIRED,
};
