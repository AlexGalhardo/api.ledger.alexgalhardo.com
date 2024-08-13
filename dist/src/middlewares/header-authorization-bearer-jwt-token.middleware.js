"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MiddlewareHeaderAuthorizationBearerJwtToken = void 0;
const jwt = require("jsonwebtoken");
require("dotenv/config");
const errors_messages_util_1 = require("../utils/errors-messages.util");
const MiddlewareHeaderAuthorizationBearerJwtToken = (ctx, next) => {
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
            }
            catch (error) {
                ctx.status = 401;
                ctx.body = { error: errors_messages_util_1.ErrorsMessages.INVALID_JWT_TOKEN };
                return;
            }
        }
        else {
            ctx.status = 401;
            ctx.body = { error: errors_messages_util_1.ErrorsMessages.JWT_TOKEN_REQUIRED };
            return;
        }
    }
    return next();
};
exports.MiddlewareHeaderAuthorizationBearerJwtToken = MiddlewareHeaderAuthorizationBearerJwtToken;
//# sourceMappingURL=header-authorization-bearer-jwt-token.middleware.js.map