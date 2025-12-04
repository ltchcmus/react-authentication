import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter<T> implements ExceptionFilter {
	catch(exception: T, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const status = exception instanceof Error ? 500 : 400;
		response.status(status).json({
			code: status,
			message: exception instanceof Error ? exception.message : 'An error occurred',
		});
	}
}
