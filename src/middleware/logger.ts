import { type Context, type Next } from 'koa'
import logger from '../config/loggingConfig';

async function logMiddleware(ctx: Context, next: Next): Promise<void> {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`, {
        statusCode: ctx.status,
    });
};

export default logMiddleware;
