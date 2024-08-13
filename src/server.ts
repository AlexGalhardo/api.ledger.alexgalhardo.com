import Koa from "koa";
import * as mount from "koa-mount";
import { graphqlHTTP } from "koa-graphql";
import GraphqlSchema from "./graphql/schema";
import { API_URL } from "./utils/constants";

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
    .listen(process.env.PORT || 3000, () => {
        console.log(`\n\n api.ledger.alexgalhardo.com server running on port ${API_URL}/graphql`);
    });

export default app;
