import { Test, TestingModule } from '@nestjs/testing';
import { CryptoLogicService } from './crypto-logic.service';
import { InternalServerErrorException } from '@nestjs/common';
import { CryptoException } from 'src/common/exceptions';

jest.mock('fs', () => ({
  readFileSync: jest.fn((filePath) => {
    if (filePath.includes('private.pem')) {
      // 🚨 แทนที่ด้วย Private Key ของคุณ (RSA-2048 หรือ 4096)
      return `-----BEGIN RSA PRIVATE KEY-----
MIICWgIBAAKBgFfYIsTP5Bkls8pLiBG2tDwQd/DlNM7n8ioxeke19vZCndYWNVf0
utrLvkZgLsX3DirUaXD0oWEE0MSarD1Ln4ih/hQJTIJOsfzoDkPs+wBL0+frko85
W5MKVOfn5Ndhjab9oIFwHxYqfgGXZA5wS180ugQJImxQpBVolhmx28sfAgMBAAEC
gYBExaWSx98gAPBc8/03QP6h95KvOgK56cUhW1MMSV1rNoQzU3e3wJV5LgFtP2fe
/KhOx7U1BZBCUG7RPPaTllzyxG4fv8j58JCfzuQu1/beckm49FGP9Bq2/6MMKQCr
pr+4+Y+1qRTLdgNG8yiU5rrp6kbNSl6/s5Tf5TNmz1/YgQJBAJeGhuCb15l8FQjU
qnBop8caHI4Y+yy/MVwoSg2R5On72NabAHdc+HiWPPRsg5facrW7uk9aKMzFkGp0
I8i9128CQQCUaVxFw+CvsHw9zjem+UGzaAz04glfmjsHtxXmPBeSWy6QCVwLr6Hc
s42uKmothcbPQqp5zAufEad9U+9j9u9RAkALHmL9TlI2wAUnHbvX/cX59S+NOcYM
lYcAtTAh6Me8Z6+Up9ET8S2GY7fbU68gUHZEYZ8dPYdq50Ben2EU1OFfAkBMksgP
Hu+Q9ohEA2BngHfLr0XwG6gmcZc/ddGQxzSKSQ2PN6UMSoRDMUlKsYuzDTD0wzre
OM9ONXerjGEZvNDhAkAw7zC8Bkm7bmIhBf7/QiJFz2nz2nBp7U6R+mvzV6uMpekB
rZA4Pt8AwerFjyG11itz2fKzQbl3dbpa3WZPuw7N
-----END RSA PRIVATE KEY-----`;
    }
    if (filePath.includes('public.pem')) {
      // 🚨 แทนที่ด้วย Public Key ของคุณ
      return `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgFfYIsTP5Bkls8pLiBG2tDwQd/Dl
NM7n8ioxeke19vZCndYWNVf0utrLvkZgLsX3DirUaXD0oWEE0MSarD1Ln4ih/hQJ
TIJOsfzoDkPs+wBL0+frko85W5MKVOfn5Ndhjab9oIFwHxYqfgGXZA5wS180ugQJ
ImxQpBVolhmx28sfAgMBAAE=
-----END PUBLIC KEY-----`;
    }
    throw new Error('Mock: Key file not found for testing.');
  }),
}));

describe('CryptoLogicService', () => {
  let service: CryptoLogicService;

  const originalAesKey = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2'; // 32 bytes hex key
  const originalIv = '1234567890abcdef1234567890abcdef'; // 16 bytes hex iv
  const originalPayload = 'Hello, this is a test payload for encryption/decryption!';

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CryptoLogicService],
    }).compile();

    service = module.get<CryptoLogicService>(CryptoLogicService);
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- Test Case 2: การสร้าง Key/IV ---
  it('2. should generate a 32-byte AES key (64 hex chars) and 16-byte IV (32 hex chars)', () => {
    const { key, iv } = service.generateAesKeyAndIV();
    expect(key.length).toBe(64);
    expect(iv.length).toBe(32);
  });

  // --- Test Case 3: การเข้ารหัสและถอดรหัส AES ---
  it('3. should encrypt and decrypt payload successfully using AES-256-CBC', () => {
    // 3.1 Encrypt
    const encryptedData = service.encryptAes(originalPayload, originalAesKey, originalIv);
    expect(encryptedData).toBeDefined();
    // ตรวจสอบว่าผลลัพธ์มีรูปแบบ IV:EncryptedData
    expect(encryptedData).toContain(originalIv + ':');

    // 3.2 Decrypt
    const decryptedPayload = service.decryptAes(encryptedData, originalAesKey);
    expect(decryptedPayload).toEqual(originalPayload);
  });

  // --- Test Case 4: การเข้ารหัสและถอดรหัส RSA สำหรับ AES Key ---
  it('4. should encrypt AES Key with Private Key and decrypt with Public Key (RSA)', () => {
    // 4.1 Encrypt AES Key (จำลอง data1)
    const encryptedKeyRsa = service.encryptAesKeyRsa(originalAesKey);
    expect(encryptedKeyRsa).toBeDefined();
    expect(encryptedKeyRsa).not.toEqual(originalAesKey); // ต้องไม่เท่ากับ Key เดิม

    // 4.2 Decrypt AES Key
    const decryptedAesKey = service.decryptAesKeyRsa(encryptedKeyRsa);
    expect(decryptedAesKey).toEqual(originalAesKey); // ต้องถอดรหัสกลับมาได้ Key เดิม
  });

  // --- Test Case 5: End-to-End Hybrid Encryption Flow ---
  it('5. should successfully perform the full encrypt-decrypt hybrid cycle', () => {
    // ENCRYPT PROCESS
    const { key, iv } = service.generateAesKeyAndIV(); // 1. Generate AES Key/IV
    const data2 = service.encryptAes(originalPayload, key, iv); // 2. Encrypt Payload
    const data1 = service.encryptAesKeyRsa(key); // 3. Encrypt AES Key

    // DECRYPT PROCESS
    const decryptedAesKey = service.decryptAesKeyRsa(data1); // 4. Decrypt AES Key
    const finalPayload = service.decryptAes(data2, decryptedAesKey); // 5. Decrypt Payload

    expect(finalPayload).toEqual(originalPayload);
  });


});
