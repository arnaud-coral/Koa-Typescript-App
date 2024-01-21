import { type Context, type Next } from 'koa';
import logger from '../config/loggingConfig';

export class HttpError extends Error {
    status: number;
    code: string;

    constructor(message: string, status: number, code: string) {
        super(message);
        this.name = 'HttpError';
        this.status = status;
        this.code = code;
    }
}

async function errorHandler(ctx: Context, next: Next): Promise<void> {
    try {
        await next();
    } catch (error) {
        ctx.set('Content-Type', 'application/json');

        if (error instanceof HttpError) {
            ctx.status = error.status;
            ctx.body = {
                result: 'error',
                data: {
                    code: error.code,
                    status: error.status,
                    message: error.message,
                },
            };
        } else {
            const unknownError = error as Error;
            ctx.status = 500;
            ctx.body = {
                result: 'error',
                data: {
                    code: 'INTERNAL_SERVER_ERROR',
                    status: 500,
                    message: 'An internal server error occurred.',
                },
            };

            logger.error('Uncaught error:', {
                error: {
                    message: unknownError.message,
                    stack: unknownError.stack,
                },
            });
        }
    }
};

export default errorHandler;
