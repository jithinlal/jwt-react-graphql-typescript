import { Field, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity } from 'typeorm';

// * we are using object type because we want to expose the type orm model as a graphql type
@ObjectType()
// * users is the table name
@Entity('users')
export class User extends BaseEntity {
	// * base entity enables us to use the .save and other helpful functions
	@Field(() => Int)
	@PrimaryGeneratedColumn()
	id: number;

	@Field()
	@Column('text')
	email: string;

	// * database column type
	@Column('text')
	password: string;
}
