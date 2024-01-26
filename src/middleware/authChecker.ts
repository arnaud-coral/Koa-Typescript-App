import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { HttpError } from './errorHandler';
import config from '../config/constants';

const JWT_SECRET = config.jwtSecret;

async function authChecker(ctx: Context, next: Next): Promise<void> {
    try {
        const token = ctx.cookies.get('Authorization') || ctx.headers.authorization;

        if (!token) {
            throw new HttpError('No token provided', 401, 'NO_TOKEN');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        if (decoded && decoded.userId) {
            ctx.state.user = { id: decoded.userId };
        }

        await next();
    } catch (error) {
        throw error;
    }
}

export default authChecker;
