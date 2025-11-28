import { ApiProperty } from "@nestjs/swagger";
import { BaseResponseDto } from "./base-response.dto";

export class EncryptResponseDto extends BaseResponseDto {
    constructor(partial: Partial<EncryptResponseDto>) {
        super(partial);
    }

    @ApiProperty({ type: () => EncryptDataDto, nullable: true })
    data: EncryptDataDto | null;
}

export class EncryptDataDto {
    @ApiProperty({ description: 'AES Key ที่เข้ารหัสด้วย Public Key' })
    data1: string;

    @ApiProperty({ description: 'Payload ที่เข้ารหัสด้วย AES Key' })
    data2: string;
}
