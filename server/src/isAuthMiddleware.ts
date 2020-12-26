import { verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { MyContext } from './MyContext';

export const isAuthMiddleware: MiddlewareFn<MyContext> = (
	{ context },
	next,
) => {
	try {
		const authorization = context.req.headers['authorization'];

		if (!authorization) {
			throw new Error('Not authenticated!');
		}

		const token = authorization.split(' ')[1];
		const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
		context.payload = payload as any;

		return next();
	} catch (error) {
		console.error(error);
		throw new Error('Not authenticated!');
	}
};
