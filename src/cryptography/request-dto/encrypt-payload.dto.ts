import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, Length } from "class-validator";

export class EncryptPayloadDto {
    @ApiProperty({
        description: "Payload to encrypt",
        required: true,
        minLength: 0,
        maxLength: 2000,
        example: "This is secret message"
    })
    @IsString({ message: "Payload must be a string" })
    @IsNotEmpty({ message: "Payload is required" })
    @Length(0, 2000, { message: "Payload must be between 0 and 2000 characters" })
    payload: string;
}
