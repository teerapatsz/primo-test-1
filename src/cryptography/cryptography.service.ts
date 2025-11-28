import { HttpStatus, Injectable } from '@nestjs/common';
import { EncryptPayloadDto } from './request-dto/encrypt-payload.dto';
import { plainToInstance } from 'class-transformer';
import { EncryptResponseDto } from './response-dto/encrypt-response.dto';
import { CryptoLogicService } from 'src/shared/crypto-logic/crypto-logic.service';
import { DecryptPayloadDto } from './request-dto/decrypt-payload.dto';
import { DecryptResponseDto } from './response-dto/decrypt-response.dto';

@Injectable()
export class CryptographyService {
  constructor(private readonly cryptoLogicService: CryptoLogicService) { }

  encryptData(encryptPayloadDto: EncryptPayloadDto) {
    // สร้าง AES key และ IV แบบสุ่ม
    const { key, iv } = this.cryptoLogicService.generateAesKeyAndIV();
    const payload = encryptPayloadDto.payload;

    // เข้ารหัส payload ด้วย AES key/IV (data2)
    const data2 = this.cryptoLogicService.encryptAes(payload, key, iv);

    // เข้ารหัส AES key ด้วย Private Key ของ RSA (data1)
    const data1 = this.cryptoLogicService.encryptAesKeyRsa(key);

    // response data1, data2
    const responseBody: EncryptResponseDto = {
      successful: true,
      error_code: '0000',
      data: { data1, data2 },
    };

    return responseBody;
  }

  decryptData(decryptPayloadDto: DecryptPayloadDto) {
    const { data1, data2 } = decryptPayloadDto;

    // ถอดรหัส AES Key ด้วย Private Key ของ RSA
    const aesKey = this.cryptoLogicService.decryptAesKeyRsa(data1);

    // ถอดรหัส Payload ด้วย AES Key
    const payload = this.cryptoLogicService.decryptAes(data2, aesKey);

    // response payload
    const responseBody: DecryptResponseDto = {
      successful: true,
      error_code: '0000',
      data: { payload },
    };
    return responseBody;
  }
}
