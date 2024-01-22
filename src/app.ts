import Koa from 'koa';
import errorHandler from './middleware/errorHandler';
import responseFormatter from './middleware/responseFormatter';
import loggerMiddleware from './middleware/logger';
import bodyParser from 'koa-bodyparser';
import helmet from 'koa-helmet';
import cors from '@koa/cors';
import rateLimit from 'koa-ratelimit';
import Redis from 'ioredis';
import connectDB from './helpers/mongoConnector';
import loadRoutes from './helpers/routesLoader';


const REDIS_HOST = process.env.REDIS_HOST || 'redis';
const REDIS_PORT = process.env.REDIS_PORT
    ? parseInt(process.env.REDIS_PORT, 10)
    : 6379;

const app = new Koa();

connectDB().catch((error) => {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
});

const redis = new Redis({
    port: REDIS_PORT,
    host: REDIS_HOST,
});

app.use(helmet());
app.use(
    cors({
        origin: '*',
        allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
    })
);
app.use(bodyParser());
app.use(loggerMiddleware);
app.use(errorHandler);
app.use(responseFormatter);

const routes = loadRoutes();
routes.forEach((route) => {
    app.use(route.routes()).use(route.allowedMethods());
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

export default app;
