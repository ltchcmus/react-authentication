import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export default class LoginUserRequest {
	@IsEmail({}, { message: 'Invalid email format' })
	@IsNotEmpty({ message: 'Email is required' })
	email: string;

	@Length(6, 50)
	@IsNotEmpty()
	password: string;
}
