import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

export default new DataSource({
	type: process.env.DB_TYPE as 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,

	entities: ['src/entity/**/*.ts'],
	migrations: ['src/migrations/*.ts'],

	synchronize: process.env.NODE_ENV === 'development', // Tự động sync entities với database (chỉ dùng dev)
	migrationsRun: false,
});
