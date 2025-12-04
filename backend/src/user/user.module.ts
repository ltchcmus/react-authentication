import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/entity/user';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Module({
	imports: [
		TypeOrmModule.forFeature([User]),
		PassportModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET') || 'CHANGE_ME',
				signOptions: {
					expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '15m',
				} as any,
			}),
		}),
	],
	controllers: [UserController],
	providers: [UserService, JwtStrategy],
})
export class UserModule {}
