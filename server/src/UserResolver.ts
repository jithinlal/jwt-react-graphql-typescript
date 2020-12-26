import { compare, hash } from 'bcryptjs';
import {
	Arg,
	Ctx,
	Field,
	Int,
	Mutation,
	ObjectType,
	Query,
	Resolver,
	UseMiddleware,
} from 'type-graphql';
import { getConnection } from 'typeorm';
import { createAccessToken, createRefreshToken } from './auth';
import { User } from './entity/User';
import { isAuthMiddleware } from './isAuthMiddleware';
import { MyContext } from './MyContext';
import { sendRefreshToken } from './utils/sendRefreshToken';

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
	@UseMiddleware(isAuthMiddleware)
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
		@Ctx() { res }: MyContext,
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

			sendRefreshToken(res, createRefreshToken(user));

			return {
				accessToken: createAccessToken(user),
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

	// ! don't write a mutation for revoking tokens. Keep this logic inside a function
	@Mutation(() => Boolean)
	async revokeRefreshTokensForUser(@Arg('userId', () => Int) userId: number) {
		await getConnection()
			.getRepository(User)
			.increment({ id: userId }, 'tokenVersion', 1);

		return true;
	}
}
