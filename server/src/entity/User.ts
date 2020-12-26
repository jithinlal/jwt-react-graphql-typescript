import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// * users is the table name
@Entity('users')
export class User extends BaseEntity {
	// * base entity enables us to use the .save and other helpful functions
	@PrimaryGeneratedColumn()
	id: number;

	@Column('text')
	email: string;

	// * database column type
	@Column('text')
	password: string;
}
