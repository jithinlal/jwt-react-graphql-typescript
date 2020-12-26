import 'dotenv/config';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import { buildSchema } from 'type-graphql';
import { createConnection } from 'typeorm';
import { UserResolver } from './UserResolver';

(async () => {
	const app = express();

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
