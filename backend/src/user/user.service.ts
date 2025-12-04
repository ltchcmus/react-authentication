import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from 'src/entity/user';
import RegisterUserRequest from 'src/user/dtos/request/register-user.request.dto';
import LoginUserRequest from 'src/user/dtos/request/login-user.request.dto';
import UpdateProfileRequest from 'src/user/dtos/request/update-profile.request.dto';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import LoginUserResponse from 'src/user/dtos/response/login-user.request.dto';
import UserProfileResponse from 'src/user/dtos/response/user-profile.response.dto';
import { AppException } from 'src/exception/app-exception';
import ErrorCode from 'src/exception/error-code';
import RegisterUserResponse from 'src/user/dtos/response/register-user.response.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
	constructor(
		@InjectRepository(User) private userRepository: Repository<User>,
		private jwtService: JwtService,
		private configService: ConfigService,
	) {}

	async registerUser(request: RegisterUserRequest): Promise<RegisterUserResponse> {
		const newUser = this.userRepository.create({
			email: request.email,
			password: await bcrypt.hash(request.password, 10),
			name: request.name || null,
			birthOfDay: request.birthOfDay ? new Date(request.birthOfDay) : null,
			address: request.address || null,
		});
		try {
			if (await this.userRepository.findOneBy({ email: request.email })) {
				throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
			}
			const savedUser = await this.userRepository.save(newUser);
			return new RegisterUserResponse({
				userId: savedUser.userId,
				email: savedUser.email,
				createdAt: savedUser.createdAt,
			});
		} catch (error) {
			if (error instanceof AppException) {
				throw error;
			}
			throw new AppException(ErrorCode.USER_ALREADY_EXISTS);
		}
	}

	async loginUser(request: LoginUserRequest): Promise<LoginUserResponse> {
		const user = await this.userRepository.findOneBy({ email: request.email });
		if (!user) {
			throw new AppException(ErrorCode.LOGIN_FAILED);
		}
		if (!(await bcrypt.compare(request.password, user.password))) {
			throw new AppException(ErrorCode.LOGIN_FAILED);
		}

		// Create access token with 5 min expiration
		const payload = { email: user.email, sub: user.userId };
		const accessToken = this.jwtService.sign(payload, {
			secret: this.configService.get<string>('JWT_SECRET'),
			expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '5m',
		} as any);

		return new LoginUserResponse({
			userId: user.userId,
			email: user.email,
			name: user.name,
			birthOfDay: user.birthOfDay,
			address: user.address,
			accessToken,
			createdAt: user.createdAt,
		});
	}

	async getUserById(userId: string): Promise<UserProfileResponse | null> {
		const user = await this.userRepository.findOneBy({ userId });
		if (!user) return null;
		return new UserProfileResponse({
			userId: user.userId,
			email: user.email,
			name: user.name,
			birthOfDay: user.birthOfDay,
			address: user.address,
			createdAt: user.createdAt,
		});
	}

	async updateProfile(
		userId: string,
		data: UpdateProfileRequest,
	): Promise<UserProfileResponse | null> {
		const updateData: Partial<User> = {};
		if (data.name !== undefined) updateData.name = data.name;
		if (data.birthOfDay !== undefined) updateData.birthOfDay = new Date(data.birthOfDay);
		if (data.address !== undefined) updateData.address = data.address;

		await this.userRepository.update({ userId }, updateData);
		const user = await this.userRepository.findOneBy({ userId });
		if (!user) return null;
		return new UserProfileResponse({
			userId: user.userId,
			email: user.email,
			name: user.name,
			birthOfDay: user.birthOfDay,
			address: user.address,
			createdAt: user.createdAt,
		});
	}
}
