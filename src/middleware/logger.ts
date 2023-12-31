import { type Context, type Next } from 'koa'
import type Koa from 'koa';
import logger from '../config/loggingConfig';

const logMiddleware: Koa.Middleware = async (ctx: Context, next: Next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`, { statusCode: ctx.status });
};

export default logMiddleware;
