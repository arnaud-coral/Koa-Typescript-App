import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import rateLimit from 'koa-ratelimit';
import Redis from 'ioredis';
import errorHandler from './middleware/errorHandler';
import loggerMiddleware from './middleware/logger';

import healthcheckRoute from './routes/healthCheckRoute';

const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379;

const app = new Koa();

const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
});

app.use(
    rateLimit({
        driver: 'redis',
        db: redis,
        duration: 60000,
        errorMessage: 'Rate limit exceeded',
        id: (ctx) => ctx.ip,
        headers: {
            remaining: 'Rate-Limit-Remaining',
            reset: 'Rate-Limit-Reset',
            total: 'Rate-Limit-Total',
        },
        max: 100,
    })
);
app.use(
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);
app.use(helmet());
app.use(bodyParser());
app.use(errorHandler);
app.use(loggerMiddleware);

app.use(healthcheckRoute.routes());
app.use(healthcheckRoute.allowedMethods());

export default app;
