import Koa from "koa";
import mount from "koa-mount";
import { graphqlHTTP } from "koa-graphql";
import GraphqlSchema from "./graphql/schema";

const app = new Koa();

app.use(
	mount(
		"/graphql",
		graphqlHTTP({
			schema: GraphqlSchema,
			graphiql: true,
		}),
	),
);

app.use(async (ctx, next) => {
	if (ctx.method === "GET" && ctx.path === "/") {
		ctx.body = { success: true, graphql: `http://localhost:${process.env.PORT || 4000}/graphql` };
	} else {
		await next();
	}
});

app.listen(process.env.PORT || 4000, () => {
	console.log(
		`api.ledger.alexgalhardo.com server running on port http://localhost:${process.env.PORT || 4000}/graphql`,
	);
});
