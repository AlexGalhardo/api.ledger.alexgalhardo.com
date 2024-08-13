import { Context } from "koa";
import "dotenv/config";
export declare const MiddlewareHeaderAuthorizationBearerJwtToken: (ctx: Context, next: () => Promise<any>) => Promise<any>;
