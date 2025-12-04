import HttpResponse from 'src/http-response';
import { Body, Controller, Post, Req, Res, Get, Patch, UseGuards } from '@nestjs/common';
import RegisterUserRequest from 'src/user/dtos/request/register-user.request.dto';
import { UserService } from 'src/user/user.service';
import RegisterUserResponse from 'src/user/dtos/response/register-user.response.dto';
import LoginUserResponse from 'src/user/dtos/response/login-user.request.dto';
import LoginUserRequest from 'src/user/dtos/request/login-user.request.dto';
import type { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import UpdateProfileRequest from 'src/user/dtos/request/update-profile.request.dto';
import UserProfileResponse from 'src/user/dtos/response/user-profile.response.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UserController {
	constructor(
		private readonly userService: UserService,
		private configService: ConfigService,
		private jwtService: JwtService,
	) {}

	@Post('register')
	async registerUser(
		@Body() request: RegisterUserRequest,
	): Promise<HttpResponse<RegisterUserResponse>> {
		return new HttpResponse<RegisterUserResponse>(
			200,
			'User registered successfully',
			await this.userService.registerUser(request),
		);
	}

	@Post('login')
	async loginUser(
		@Body() request: LoginUserRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<HttpResponse<LoginUserResponse>> {
		const loginResp = await this.userService.loginUser(request);

		// Recreate refresh token to set cookie
		const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
		const refreshToken = this.jwtService.sign({ sub: loginResp.userId }, {
			secret: refreshSecret,
			expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN') || '30m',
		} as any);

		// Set httpOnly secure cookie
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: this.configService.get<string>('NODE_ENV') === 'production',
			sameSite:
				this.configService.get<string>('NODE_ENV') === 'production' ? 'none' : 'lax',
			maxAge: 1000 * 60 * 30, // 30 minutes
			path: '/',
		});

		return new HttpResponse<LoginUserResponse>(
			200,
			'User logged in successfully',
			loginResp,
		);
	}

	@Post('logout')
	logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
		try {
			res.clearCookie('refreshToken');
			return new HttpResponse<any>(200, 'Logged out');
		} catch (err: any) {
			console.error('Logout error:', err);
			return new HttpResponse<any>(500, 'Logout failed');
		}
	}

	@Get('me')
	@UseGuards(AuthGuard('jwt'))
	async me(
		@Req() req: any,
		@Res({ passthrough: true }) res: Response,
	): Promise<HttpResponse<UserProfileResponse>> {
		// Try to verify access token from Authorization header
		const authHeader = req.headers.authorization;
		let userId: string | null = null;
		let newAccessToken: string | null = null;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.substring(7);
			let expiredAccessTokenUserId: string | null = null;
			try {
				const payload: any = this.jwtService.verify(token);
				userId = payload.sub;
			} catch (err: any) {
				console.error('Access token verification error:', err);
				// Try to decode expired token to get userId for security check
				try {
					const decoded: any = this.jwtService.decode(token);
					if (decoded?.sub) {
						expiredAccessTokenUserId = decoded.sub;
					}
				} catch (_) {
					console.error('Access token decode error:', _);
				}

				// Access token invalid/expired, try refresh token
				const refreshToken = req.cookies?.refreshToken;
				if (!refreshToken) {
					return new HttpResponse<any>(401, 'Unauthorized');
				}

				try {
					const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
					const refreshPayload: any = this.jwtService.verify(refreshToken, {
						secret: refreshSecret,
					} as any);

					// Security check: verify userId from expired access token matches refresh token
					if (
						expiredAccessTokenUserId &&
						expiredAccessTokenUserId !== refreshPayload.sub
					) {
						res.clearCookie('refreshToken');
						return new HttpResponse<any>(401, 'Token mismatch');
					}

					const user = await this.userService.getUserById(refreshPayload.sub);

					if (!user) {
						res.clearCookie('refreshToken');
						return new HttpResponse<any>(401, 'Invalid refresh token');
					}

					// Generate new access token
					userId = user.userId;
					newAccessToken = this.jwtService.sign({ email: user.email, sub: user.userId }, {
						expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '5m',
					} as any);
				} catch (_) {
					console.error('Refresh token verification error:', _);
					res.clearCookie('refreshToken');
					return new HttpResponse<any>(401, 'Refresh token invalid or expired');
				}
			}
		} else {
			return new HttpResponse<any>(401, 'No token provided');
		}

		if (!userId) {
			return new HttpResponse<any>(401, 'Unauthorized');
		}

		const user = await this.userService.getUserById(userId);
		if (!user) {
			return new HttpResponse<any>(404, 'User not found');
		}

		// If new access token was generated, include it in response
		if (newAccessToken) {
			user.accessToken = newAccessToken;
		}

		return new HttpResponse<UserProfileResponse>(200, 'OK', user);
	}

	@Patch('me')
	@UseGuards(AuthGuard('jwt'))
	async updateMe(
		@Req() req: any,
		@Body() body: UpdateProfileRequest,
		@Res({ passthrough: true }) res: Response,
	): Promise<HttpResponse<UserProfileResponse>> {
		// Try to verify access token from Authorization header
		const authHeader = req.headers.authorization;
		let userId: string | null = null;
		let newAccessToken: string | null = null;

		if (authHeader && authHeader.startsWith('Bearer ')) {
			const token = authHeader.substring(7);
			let expiredAccessTokenUserId: string | null = null;
			try {
				const payload: any = this.jwtService.verify(token);
				userId = payload.sub;
			} catch (err: any) {
				console.error('Access token verification error:', err);
				// Try to decode expired token to get userId for security check
				try {
					const decoded: any = this.jwtService.decode(token);
					if (decoded?.sub) {
						expiredAccessTokenUserId = decoded.sub;
					}
				} catch (_) {
					console.error('Access token decode error:', _);
					// Ignore decode errors
				}

				// Access token invalid/expired, try refresh token
				const refreshToken = req.cookies?.refreshToken;
				if (!refreshToken) {
					res.clearCookie('refreshToken');
					return new HttpResponse<any>(401, 'Unauthorized');
				}

				try {
					const refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
					const refreshPayload: any = this.jwtService.verify(refreshToken, {
						secret: refreshSecret,
					} as any);

					// Security check: verify userId from expired access token matches refresh token
					if (
						expiredAccessTokenUserId &&
						expiredAccessTokenUserId !== refreshPayload.sub
					) {
						res.clearCookie('refreshToken');
						return new HttpResponse<any>(401, 'Token mismatch');
					}

					const user = await this.userService.getUserById(refreshPayload.sub);

					if (!user) {
						res.clearCookie('refreshToken');
						return new HttpResponse<any>(401, 'Invalid refresh token');
					} // Generate new access token
					userId = user.userId;
					newAccessToken = this.jwtService.sign({ email: user.email, sub: user.userId }, {
						expiresIn: this.configService.get<string>('JWT_EXPIRES_IN') || '5m',
					} as any);
				} catch (_) {
					console.error('Refresh token verification error:', _);
					return new HttpResponse<any>(401, 'Refresh token invalid or expired');
				}
			}
		} else {
			res.clearCookie('refreshToken');
			return new HttpResponse<any>(401, 'No token provided');
		}

		if (!userId) {
			return new HttpResponse<any>(401, 'Unauthorized');
		}

		const updated = await this.userService.updateProfile(userId, body);
		if (!updated) {
			return new HttpResponse<any>(404, 'User not found');
		}

		// If new access token was generated, include it in response
		if (newAccessToken) {
			updated.accessToken = newAccessToken;
		}

		return new HttpResponse<UserProfileResponse>(200, 'Profile updated', updated);
	}
}
