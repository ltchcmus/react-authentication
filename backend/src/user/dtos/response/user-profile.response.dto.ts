export default class UserProfileResponse {
	userId: string;
	email: string;
	name?: string;
	birthOfDay?: Date;
	address?: string;
	createdAt: Date;
	accessToken?: string; // Include if new token was generated

	constructor({
		userId,
		email,
		name,
		birthOfDay,
		address,
		createdAt,
		accessToken,
	}: {
		userId: string;
		email: string;
		name?: string;
		birthOfDay?: Date;
		address?: string;
		createdAt: Date;
		accessToken?: string;
	}) {
		this.userId = userId;
		this.email = email;
		this.name = name;
		this.birthOfDay = birthOfDay;
		this.address = address;
		this.createdAt = createdAt;
		if (accessToken) {
			this.accessToken = accessToken;
		}
	}
}
