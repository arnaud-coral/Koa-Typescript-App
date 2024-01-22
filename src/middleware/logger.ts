import { type Context, type Next } from 'koa'
import logger from '../config/loggingConfig';

async function logMiddleware(ctx: Context, next: Next): Promise<void> {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;

    if (ctx.status < 400) {
        logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`, {
            status: ctx.status,
        });
    } else {
        logger.error(`${ctx.method} ${ctx.url} - ${ms}ms`, {
            status: ctx.status,
        });
    }
};

export default logMiddleware;
