import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import {
	Arg,
	Field,
	Mutation,
	ObjectType,
	Query,
	Resolver,
} from 'type-graphql';
import { User } from './entity/User';

@ObjectType()
class LoginResponse {
	@Field()
	accessToken: string;

	@Field()
	errorMessage: string;
}

@Resolver()
export class UserResolver {
	@Query(() => [User])
	users() {
		return User.find();
	}

	@Mutation(() => Boolean)
	async register(
		@Arg('email') email: string,
		@Arg('password') password: string,
	) {
		try {
			const hashedPass = await hash(password, 12);

			await User.insert({
				email,
				password: hashedPass,
			});

			return true;
		} catch (error) {
			console.error(error);
			return false;
		}
	}

	@Mutation(() => LoginResponse)
	async login(
		@Arg('email') email: string,
		@Arg('password') password: string,
	): Promise<LoginResponse> {
		try {
			const user = await User.findOne({ where: { email } });
			if (!user) {
				throw new Error('User does not exist!');
			}

			const valid = await compare(password, user.password);
			if (!valid) {
				throw new Error('Invalid login credentials!');
			}

			return {
				accessToken: sign({ userId: user.id }, 'secret_random_string', {
					expiresIn: '15m',
				}),
				errorMessage: '',
			};
		} catch (error) {
			console.error(error);
			return {
				accessToken: '',
				errorMessage: error.message,
			};
		}
	}
}
