import { Controller, Post, Body } from '@nestjs/common';
import { CryptographyService } from './cryptography/cryptography.service';
import { EncryptPayloadDto } from './cryptography/request-dto/encrypt-payload.dto';
import { DecryptPayloadDto } from './cryptography/request-dto/decrypt-payload.dto';
import { ApiResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { EncryptResponseDto } from './cryptography/response-dto/encrypt-response.dto';
import { DecryptResponseDto } from './cryptography/response-dto/decrypt-response.dto';
import { ErrorCode } from './common/constants/error-code';

@Controller()
export class AppController {
  constructor(
    private readonly cryptographyService: CryptographyService
  ) { }

  @Post('get-encrypt-data')
  @ApiResponse({ status: 201, description: 'Successful encryption', type: EncryptResponseDto })
  @ApiBadRequestResponse({
    description: `Bad Request. Possible error codes:
    - ${ErrorCode.PAYLOAD_REQUIRED}: Payload is required
    - ${ErrorCode.PAYLOAD_LENGTH_INVALID}: Payload length invalid
    - ${ErrorCode.PAYLOAD_TYPE_INVALID}: Payload type invalid
    - ${ErrorCode.AES_ENCRYPTION_FAILED}: AES Encryption failed
    - ${ErrorCode.RSA_ENCRYPTION_FAILED}: RSA Encryption failed`,
    schema: {
      example: {
        successful: false,
        error_code: ErrorCode.PAYLOAD_REQUIRED,
        data: null
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  encryptData(@Body() encryptPayloadDto: EncryptPayloadDto) {
    return this.cryptographyService.encryptData(encryptPayloadDto);
  }

  @Post('get-decrypt-data')
  @ApiResponse({ status: 201, description: 'Successful decryption', type: DecryptResponseDto })
  @ApiBadRequestResponse({
    description: `Bad Request. Possible error codes:
    - ${ErrorCode.DATA1_REQUIRED}: data1 is required
    - ${ErrorCode.DATA2_REQUIRED}: data2 is required
    - ${ErrorCode.AES_DECRYPTION_FAILED}: AES Decryption failed
    - ${ErrorCode.RSA_DECRYPTION_FAILED}: RSA Decryption failed
    - ${ErrorCode.INVALID_ENCRYPTED_DATA}: Invalid encrypted data`,
    schema: {
      example: {
        successful: false,
        error_code: ErrorCode.DATA1_REQUIRED,
        data: null
      }
    }
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  decryptData(@Body() decryptPayloadDto: DecryptPayloadDto) {
    return this.cryptographyService.decryptData(decryptPayloadDto);
  }
}


