import { BaseResponseDto } from "./base-response.dto";
import { ApiProperty } from "@nestjs/swagger";

export class DecryptResponseDto extends BaseResponseDto {
    constructor(partial: Partial<DecryptResponseDto>) {
        super(partial);
    }

    @ApiProperty({ type: () => DecryptDataDto, nullable: true })
    data: DecryptDataDto | null;
}

export class DecryptDataDto {
    @ApiProperty({ description: 'Payload ที่ถอดรหัสแล้ว' })
    payload: string;
}