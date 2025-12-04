import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class User {
	@PrimaryGeneratedColumn('uuid')
	userId: string;

	@Column({ unique: true, nullable: false })
	email: string;

	@Column({ nullable: false })
	password: string;

	@Column({ nullable: true })
	name: string;

	@Column({ nullable: true, type: 'date' })
	birthOfDay: Date;

	@Column({ nullable: true })
	address: string;

	@Column({ nullable: false, type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
	createdAt: Date;
}
