import { Context } from "koa";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { ErrorsMessages } from "../utils/errors-messages.util";

export const MiddlewareHeaderAuthorizationBearerJwtToken = (ctx: Context, next: () => Promise<any>) => {
    if (ctx.method === "POST" && ctx.path === "/graphql") {
        const authHeader = ctx.request.headers.authorization;
        if (authHeader && authHeader.startsWith("Bearer ")) {
            const token = authHeader.substring(7);
            try {
                const user = jwt.verify(token, process.env.JWT_SECRET);
                ctx.state.user = user;

                const { query } = ctx.request.body;
                if (query && query.startsWith("mutation")) {
                    return next();
                }
            } catch (error) {
                ctx.status = 401;
                ctx.body = { error: ErrorsMessages.INVALID_JWT_TOKEN };
                return;
            }
        } else {
            ctx.status = 401;
            ctx.body = { error: ErrorsMessages.JWT_TOKEN_REQUIRED };
            return;
        }
    }
    return next();
};
