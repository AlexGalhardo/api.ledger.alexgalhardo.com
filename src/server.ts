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
)
    .use(async (ctx, next) => {
        if (ctx.method === "GET" && ctx.path === "/") {
            const host = ctx.host;
            ctx.body = {
                success: true,
                graphql: `http://${host}/graphql`,
            };
        } else {
            await next();
        }
    })
    .listen(process.env.PORT || 4000, () => {
        const host = process.env.HOST || "localhost" || "127.0.0.1" || "0.0.0.0";
        const port = process.env.PORT || 4000;
        console.log(`api.ledger.alexgalhardo.com server running on port http://${host}:${port}/graphql`);
    });
