import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './UserResolver';
import { verify } from 'jsonwebtoken';
import { User } from './entity/User';
import { createAccessToken } from './auth';

(async () => {
	const app = express();

	app.use(cookieParser());

	// * this is a special route to fetch a new access token
	// * with the help of a refresh token
	app.post('/refresh_token', async (req, res) => {
		try {
			const token = req.cookies[process.env.COOKIE_NAME!];
			if (!token) {
				return res.send({
					ok: false,
					accessToken: '',
				});
			}
			let payload: any = null;

			payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);

			const user = await User.findOne({ id: payload.userId });
			if (!user) {
				return res.send({
					ok: false,
					accessToken: '',
				});
			}

			return res.send({
				ok: true,
				accessToken: createAccessToken(user),
			});
		} catch (error) {
			console.error(error);
			return res.send({
				ok: false,
				accessToken: '',
			});
		}
	});

	await createConnection();

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [UserResolver],
		}),
		context: ({ req, res }) => ({
			req,
			res,
		}),
	});

	apolloServer.applyMiddleware({ app });

	app.listen(4000, () => {
		console.log(`Server started on port: 4000`);
	});
})();
