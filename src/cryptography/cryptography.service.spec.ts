import { Test, TestingModule } from '@nestjs/testing';
import { CryptographyService } from './cryptography.service';
import { CryptoLogicService } from 'src/shared/crypto-logic/crypto-logic.service';
import { EncryptPayloadDto } from './request-dto/encrypt-payload.dto';
import { DecryptPayloadDto } from './request-dto/decrypt-payload.dto';
// หากมีการใช้ HttpStatus หรือ InternalServerErrorException ในโค้ดจริง ควร import เข้ามา
import { InternalServerErrorException } from '@nestjs/common';

// 1. สร้าง Mock Class สำหรับ CryptoLogicService
const mockCryptoLogicService = {
  // Mock เมธอดทั้งหมดที่ถูกเรียกใช้ใน CryptographyService
  generateAesKeyAndIV: jest.fn(),
  encryptAes: jest.fn(),
  encryptAesKeyRsa: jest.fn(),
  decryptAesKeyRsa: jest.fn(),
  decryptAes: jest.fn(),
};

describe('CryptographyService', () => {
  let service: CryptographyService;
  let cryptoLogicService: CryptoLogicService;

  // ข้อมูลจำลองสำหรับ Input/Output
  const MOCK_AES_KEY = 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2';
  const MOCK_IV = '1234567890abcdef1234567890abcdef';
  const MOCK_PAYLOAD = 'this is a test message';
  const MOCK_DATA1 = 'RSA_ENCRYPTED_KEY_STRING';
  const MOCK_DATA2 = `${MOCK_IV}:AES_ENCRYPTED_PAYLOAD_STRING`;

  beforeEach(async () => {
    // 2. สร้าง Testing Module และใช้ Provider Mock
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptographyService,
        {
          // กำหนดให้ Inject CryptoLogicService ด้วยค่า Mock ของเรา
          provide: CryptoLogicService,
          useValue: mockCryptoLogicService,
        },
      ],
    }).compile();

    service = module.get<CryptographyService>(CryptographyService);
    cryptoLogicService = module.get<CryptoLogicService>(CryptoLogicService);
    // รีเซ็ตการนับการเรียกใช้ของ Mock ก่อนแต่ละ Test
    jest.clearAllMocks();
  });

  it('1. should be defined', () => {
    expect(service).toBeDefined();
  });

  // =======================================================
  // TEST: ENCRYPT DATA SUCCESS FLOW
  // =======================================================

  it('2. encryptData should call all crypto logic methods and return SUCCESS response', () => {
    // 2.1 กำหนดค่าที่ Mock Methods ควรส่งกลับ (Setup)
    mockCryptoLogicService.generateAesKeyAndIV.mockReturnValue({
      key: MOCK_AES_KEY,
      iv: MOCK_IV
    });
    mockCryptoLogicService.encryptAes.mockReturnValue(MOCK_DATA2);
    mockCryptoLogicService.encryptAesKeyRsa.mockReturnValue(MOCK_DATA1);

    const inputDto: EncryptPayloadDto = { payload: MOCK_PAYLOAD };

    // 2.2 เรียกใช้เมธอด
    const result = service.encryptData(inputDto);

    // 2.3 ตรวจสอบ (Assertion)

    // ตรวจสอบว่าเมธอดของ CryptoLogicService ถูกเรียกใช้ตามลำดับ
    expect(cryptoLogicService.generateAesKeyAndIV).toHaveBeenCalledTimes(1);

    // ตรวจสอบว่า encryptAes ถูกเรียกด้วย input ที่ถูกต้อง
    expect(cryptoLogicService.encryptAes).toHaveBeenCalledWith(MOCK_PAYLOAD, MOCK_AES_KEY, MOCK_IV);

    // ตรวจสอบว่า encryptAesKeyRsa ถูกเรียกด้วย key ที่ถูกต้อง
    expect(cryptoLogicService.encryptAesKeyRsa).toHaveBeenCalledWith(MOCK_AES_KEY);

    // ตรวจสอบว่า Response มีโครงสร้างและค่าที่ถูกต้อง
    expect(result.successful).toBe(true);
    expect(result.error_code).toBe('0000');
    expect(result.data).toEqual({
      data1: MOCK_DATA1,
      data2: MOCK_DATA2
    });
  });

  // =======================================================
  // TEST: DECRYPT DATA SUCCESS FLOW
  // =======================================================

  it('3. decryptData should call all crypto logic methods and return SUCCESS response with payload', () => {
    // 3.1 กำหนดค่าที่ Mock Methods ควรส่งกลับ (Setup)
    mockCryptoLogicService.decryptAesKeyRsa.mockReturnValue(MOCK_AES_KEY);
    mockCryptoLogicService.decryptAes.mockReturnValue(MOCK_PAYLOAD);

    const inputDto: DecryptPayloadDto = { data1: MOCK_DATA1, data2: MOCK_DATA2 };

    // 3.2 เรียกใช้เมธอด
    const result = service.decryptData(inputDto);

    // 3.3 ตรวจสอบ (Assertion)

    // ตรวจสอบว่า decryptAesKeyRsa ถูกเรียกด้วย data1
    expect(cryptoLogicService.decryptAesKeyRsa).toHaveBeenCalledWith(MOCK_DATA1);

    // ตรวจสอบว่า decryptAes ถูกเรียกด้วย data2 และ aesKey ที่ถอดรหัสแล้ว
    expect(cryptoLogicService.decryptAes).toHaveBeenCalledWith(MOCK_DATA2, MOCK_AES_KEY);

    // ตรวจสอบว่า Response มีโครงสร้างและค่าที่ถูกต้อง
    expect(result.successful).toBe(true);
    expect(result.error_code).toBe('0000');
    expect(result.data).toEqual({ payload: MOCK_PAYLOAD });
  });

  // =======================================================
  // TEST: FAILURE FLOW
  // =======================================================

});