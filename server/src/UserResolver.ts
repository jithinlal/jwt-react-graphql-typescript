import { hash } from 'bcryptjs';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { User } from './entity/User';

@Resolver()
export class UserResolver {
	@Query(() => String)
	hello() {
		return 'wdlkng';
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
}
