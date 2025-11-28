import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class DecryptPayloadDto {
    @ApiProperty({ description: 'AES Key ที่เข้ารหัสด้วย Public Key' })
    @IsString({ message: "data1 must be a string" })
    @IsNotEmpty({ message: "data1 should not be empty" })
    data1: string;

    @ApiProperty({ description: 'Payload ที่เข้ารหัสด้วย AES Key' })
    @IsString({ message: "data2 must be a string" })
    @IsNotEmpty({ message: "data2 should not be empty" })
    data2: string;
}