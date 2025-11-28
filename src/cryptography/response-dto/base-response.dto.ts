import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString } from "class-validator";

export class BaseResponseDto {
    @ApiProperty({ example: true })
    @IsBoolean()
    successful: boolean = true;

    @ApiProperty({ example: '0000' })
    @IsString()
    error_code: string;

    constructor(partial: Partial<BaseResponseDto>) {
        Object.assign(this, partial);
    }
}   