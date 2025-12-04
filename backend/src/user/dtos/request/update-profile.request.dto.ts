import { IsOptional, IsString, IsDateString } from 'class-validator';

export default class UpdateProfileRequest {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsDateString()
	birthOfDay?: string;

	@IsOptional()
	@IsString()
	address?: string;
}
