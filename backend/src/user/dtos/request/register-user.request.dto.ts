import { IsEmail, IsNotEmpty, Length, IsOptional, IsDateString } from 'class-validator';
import { Match } from 'src/decorator/match.validator.decorator';

export default class RegisterUserRequest {
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@Length(6, 50, { message: 'Password must be between 6 and 50 characters' })
	@IsNotEmpty({ message: 'Password is required' })
	password: string;

	@Length(6, 50, { message: 'Confirm password must be between 6 and 50 characters' })
	@IsNotEmpty({ message: 'Confirm password is required' })
	@Match('password', { message: 'Confirm password must match password' })
	confirmPassword: string;

	@IsOptional()
	name?: string;

	@IsOptional()
	@IsDateString()
	birthOfDay?: string;

	@IsOptional()
	address?: string;
}
