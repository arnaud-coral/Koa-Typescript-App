import { Context, Next } from 'koa';
import jwt from 'jsonwebtoken';
import { HttpError } from './errorHandler';

const secretKey =
    process.env.JWT_SECRET ||
    'NgYRotemandeOmEterOmEkInTeXurynCEmITORIneUMpoRymphMBionOmYcEspOtembroFAularanUTiOnAilDoXAnDERmEAHesp';

async function authChecker(ctx: Context, next: Next): Promise<void> {
    try {
        const token = ctx.cookies.get('Authorization') || ctx.headers.authorization;

        if (!token) {
            throw new HttpError('No token provided', 401, 'NO_TOKEN');
        }

        jwt.verify(token, secretKey);

        await next();
    } catch (error) {
        throw error;
    }
}

export default authChecker;
