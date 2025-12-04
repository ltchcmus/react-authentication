import { GlobalExceptionFilter } from './exception/global-exception/global-exception.filter';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import express from 'express';
import cookieParser from 'cookie-parser';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import HttpResponse from 'src/http-response';
import { CatchAppExceptionFilter } from 'src/exception/catch-app-exception/catch-app-exception.filter';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(express.json());
	app.use(cookieParser());
	app.enableCors({
		origin: process.env.FRONTEND_URL || 'http://localhost:5173',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
		credentials: true,
	});
	app.use(express.urlencoded({ extended: true }));
	app.setGlobalPrefix('api/v1');
	app.useGlobalFilters(new GlobalExceptionFilter(), new CatchAppExceptionFilter());
	app.useGlobalPipes(
		new ValidationPipe({
			whitelist: true,
			forbidNonWhitelisted: true,
			transform: true,
			exceptionFactory: (errors) => {
				const messages = errors.map((error) => ({
					field: error.property,
					constraints: error.constraints
						? Object.values(error.constraints)
						: ['Validation failed'],
				}));
				return new BadRequestException(
					new HttpResponse<any>(400, 'Validation failed', messages),
				);
			},
		}),
	);
	app.enableShutdownHooks();

	process.on('SIGTERM', () => {
		console.log('SIGTERM received, shutting down gracefully...');
	});

	process.on('SIGINT', () => {
		console.log('SIGINT received, shutting down gracefully...');
	});

	const port = process.env.PORT ?? 9999;
	await app.listen(port);
	console.log(`Server running on port ${port}`);
}
bootstrap().catch((err) => {
	console.error('Failed to start application:', err);
	process.exit(1);
});
