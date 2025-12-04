export default class LoginUserResponse {
	userId: string;
	email: string;
	name?: string;
	birthOfDay?: Date;
	address?: string;
	accessToken?: string;
	createdAt?: Date;
	constructor({
		userId,
		email,
		name,
		birthOfDay,
		address,
		accessToken,
		createdAt,
	}: {
		userId: string;
		email: string;
		name?: string;
		birthOfDay?: Date;
		address?: string;
		accessToken?: string;
		createdAt?: Date;
	}) {
		this.userId = userId;
		this.email = email;
		this.name = name;
		this.birthOfDay = birthOfDay;
		this.address = address;
		this.accessToken = accessToken;
		this.createdAt = createdAt;
	}
}
