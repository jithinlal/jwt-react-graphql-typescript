import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cookieParser from 'cookie-parser';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { verify } from 'jsonwebtoken';
import cors from 'cors';
import { UserResolver } from './UserResolver';
import { User } from './entity/User';
import { createAccessToken, createRefreshToken } from './auth';
import { sendRefreshToken } from './utils/sendRefreshToken';

(async () => {
	const app = express();

	app.use(
		cors({
			credentials: true,
			origin: 'http://localhost:3000',
		}),
	);
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

			if (user.tokenVersion !== payload.tokenVersion) {
				return res.send({
					ok: false,
					accessToken: '',
				});
			}

			sendRefreshToken(res, createRefreshToken(user));

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

	apolloServer.applyMiddleware({ app, cors: false });

	app.listen(4000, () => {
		console.log(`Server started on port: 4000`);
	});
})();
