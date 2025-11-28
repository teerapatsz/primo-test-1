import { HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/error-code';

export class BaseException extends HttpException {
    constructor(
        errorCode: ErrorCode,
        httpStatus: HttpStatus = HttpStatus.BAD_REQUEST,
        lang: 'en' | 'th' = 'en'
    ) {

        super(
            {
                successful: false,
                error_code: errorCode,
                data: null,
            },
            httpStatus,
        );
    }
}
