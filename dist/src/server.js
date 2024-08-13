"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const koa_1 = require("koa");
const mount = require("koa-mount");
const koa_graphql_1 = require("koa-graphql");
const schema_1 = require("./graphql/schema");
const constants_1 = require("./utils/constants");
const app = new koa_1.default();
app.use(mount("/graphql", (0, koa_graphql_1.graphqlHTTP)({
    schema: schema_1.default,
    graphiql: true,
})))
    .use(async (ctx, next) => {
    if (ctx.method === "GET" && ctx.path === "/") {
        const host = ctx.host;
        ctx.body = {
            success: true,
            graphql: `http://${host}/graphql`,
        };
    }
    else {
        await next();
    }
})
    .listen(process.env.PORT || 3000, () => {
    console.log(`\n\n api.ledger.alexgalhardo.com server running on port ${constants_1.API_URL}/graphql`);
});
exports.default = app;
//# sourceMappingURL=server.js.map