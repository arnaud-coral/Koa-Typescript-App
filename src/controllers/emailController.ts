import { Context } from 'koa';
import userService from '../services/userService';
import emailService from '../services/emailService';
import { HttpError } from '../middleware/errorHandler';

class EmailController {
    async validateEmail(ctx: Context) {
        const token = ctx.query.token;

        if (Array.isArray(token)) {
            throw new HttpError('Multiple tokens are not allowed', 400, 'MULTIPLE_TOKENS');
        }

        if (!token) {
            throw new HttpError('Token is required', 400, 'TOKEN_REQUIRED');
        }

        const user = await userService.validateToken(token);
        if (!user) {
            throw new HttpError('Invalid or expired token', 400, 'TOKEN_INVALID');
        }

        ctx.status = 200;
        ctx.body = { message: 'Email validated successfully.' };
    }

    async requestValidationLink(ctx: Context) {
        const userId = ctx.state.user?.id;
        if (!userId) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        const user = await userService.getUserById(userId);
        if (user?.email) {
            const isEmailValidated = await userService.isEmailValidated(userId);
            if (isEmailValidated) {
                throw new HttpError('Email address has already been validated', 400, 'EMAIL_ALREADY_VALIDATED');
            }

            const canRequestLink = await userService.canRequestValidationLink(userId);
            if (!canRequestLink) {
                throw new HttpError('Validation link can only be requested once every 15 minutes', 400, 'REQUEST_LIMIT_EXCEEDED');
            }

            const validationToken = emailService.generateEmailValidationToken();
            await userService.updateValidationToken(
                userId,
                validationToken.token,
                validationToken.expiration
            );

            emailService.sendValidationEmail(user.email, validationToken.token);
        }

        ctx.status = 200;
        ctx.body = { message: 'Validation link sent successfully.' };
    }
}

export default new EmailController();
