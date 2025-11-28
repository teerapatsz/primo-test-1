import { ExceptionFilter, Catch, ArgumentsHost, BadRequestException } from '@nestjs/common';
import { Response } from 'express';
import { VALIDATION_ERROR_MAP } from '../constants/error-code';

@Catch(BadRequestException)
export class ValidationFilter implements ExceptionFilter {
    catch(exception: BadRequestException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const status = exception.getStatus();
        const exceptionResponse = exception.getResponse() as any;
        let errorCode = '4000'; // Default error code for Bad Request

        // Logic to map validation messages to error codes
        if (typeof exceptionResponse === 'object' && Array.isArray(exceptionResponse.message)) {
            const messages = exceptionResponse.message;

            // Loop to find Error Code from map
            for (const message of messages) {
                if (VALIDATION_ERROR_MAP[message]) {
                    errorCode = VALIDATION_ERROR_MAP[message];
                    break;
                }
            }
        }

        response
            .status(status)
            .json({
                successful: false,
                error_code: errorCode,
                data: null,
            });
    }
}
