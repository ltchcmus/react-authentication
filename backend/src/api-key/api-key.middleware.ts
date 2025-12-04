import { logger } from './../logger.config';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
	PUBLIC_URLS = ['/api/v1/'];
	use(req: Request, res: Response, next: NextFunction) {
		logger.info('API Key Middleware triggered for URL:', req.originalUrl);
		if (this.PUBLIC_URLS.includes(req.originalUrl)) {
			logger.info('Public URL accessed, skipping API key check.');
			return next();
		}
		const apiKey = req.headers['x-api-key'];
		if (apiKey && apiKey === process.env.API_KEY) {
			logger.info('API Key validated successfully.');
			return next();
		} else {
			logger.warn('Unauthorized access attempt with invalid or missing API key.');
			return res
				.status(401)
				.json({ message: 'Unauthorized: Invalid or missing API key' });
		}
	}
}
