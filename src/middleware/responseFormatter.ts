import { Context, Next } from 'koa';

interface CustomResponse {
    result: string;
    status: number;
    data: {
        [key: string]: any;
    };
}

async function responseFormatter(ctx: Context, next: Next): Promise<void> {
    await next();

    if (ctx.status < 400) {
        const body = typeof ctx.body === 'object' && ctx.body !== null
            ? ctx.body
            : {};

        let responseData: CustomResponse = {
            result: 'ok',
            status: ctx.status,
            data: { ...body },
        };

        ctx.body = responseData;
    }
}

export default responseFormatter;
