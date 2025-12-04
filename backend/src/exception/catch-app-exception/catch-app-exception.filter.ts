import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';
import { AppException } from 'src/exception/app-exception';
import type ErrorCode from 'src/exception/error-code';

@Catch(AppException)
export class CatchAppExceptionFilter implements ExceptionFilter {
	catch(exception: AppException, host: ArgumentsHost) {
		const errorCode: ErrorCode = exception.errorCode;
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		response.status(errorCode.status).json({
			code: errorCode.code,
			message: errorCode.message,
		});
	}
}
