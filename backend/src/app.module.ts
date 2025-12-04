import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import User from 'src/entity/user';
import { ApiKeyMiddleware } from 'src/api-key/api-key.middleware';
@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				type: configService.get<'postgres'>('DB_TYPE'),
				host: configService.get<string>('DB_HOST'),
				port: configService.get<number>('DB_PORT'),
				username: configService.get<string>('DB_USER'),
				password: configService.get<string>('DB_PASS'),
				database: configService.get<string>('DB_NAME'),
				//autoLoadEntities: true,
				synchronize: false,
				entities: [User],
				migrations: ['dist/migrations/*.js'],
				migrationsRun: false,
			}),
		}),
		UserModule,
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule implements NestModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(ApiKeyMiddleware).forRoutes('*');
	}
}
