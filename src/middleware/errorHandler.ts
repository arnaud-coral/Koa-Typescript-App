import { type Context, type Next } from 'koa'
import type Koa from 'koa';
import logger from '../config/loggingConfig';

class HttpError extends Error {
    status: number;

    constructor (message: string, status: number) {
        super(message);
        this.status = status;
    }
}

const errorHandler: Koa.Middleware = async (ctx: Context, next: Next) => {
    try {
        await next();
    } catch (err) {
        if (err instanceof HttpError) {
            ctx.status = err.status || 500;
            ctx.body = {
                error: err.message || 'Internal Server Error'
            };

            logger.error(`Error: ${err.message}`, { stack: err.stack, status: ctx.status });
        } else {
            ctx.status = 500;
            ctx.body = { error: 'Internal Server Error' };
            logger.error('Non-Error type thrown', { status: ctx.status });
        }

        ctx.app.emit('error', err, ctx);
    }
};

export default errorHandler;
