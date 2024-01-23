import { Context } from 'koa';
import userService from '../services/userService';
import { generateJWT } from '../helpers/jwtEmitter';
import { HttpError } from '../middleware/errorHandler';

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

interface ValidateEmailRequestBody {
    token: string;
}

class UserController {
    async registerUser(ctx: Context) {
        const { username, email, password } = ctx.request.body as RegisterRequestBody;

        const isUsernameTaken = await userService.isUsernameTaken(username);
        if (isUsernameTaken) {
            throw new HttpError(
                'Username is already taken',
                400,
                'USERNAME_TAKEN'
            );
        }

        const isEmailTaken = await userService.isEmailTaken(email);
        if (isEmailTaken) {
            throw new HttpError(
                'Email is already registered',
                400,
                'EMAIL_REGISTERED'
            );
        }

        const validationToken = userService.generateValidationToken();
        const user = await userService.registerUser(
            username,
            email,
            password,
            validationToken.token,
            validationToken.expiration
        );

        userService.sendValidationEmail(user.email, validationToken.token);

        ctx.status = 201;
        ctx.body = {
            message: 'User successfully registered',
            userId: user._id,
        };
    }

    async validateEmail(ctx: Context) {
        const { token } = ctx.request.body as ValidateEmailRequestBody;
        const user = await userService.validateToken(token);

        if (!user) {
            throw new HttpError(
                'Invalid or expired token',
                400,
                'TOKEN_INVALID'
            );
        }

        ctx.status = 200;
        ctx.body = { message: 'Email validated successfully.' };
    }

    async loginUser(ctx: Context) {
        const { email, password } = ctx.request.body as LoginRequestBody;
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            throw new HttpError(
                'Invalid email or password',
                401,
                'INVALID_CREDENTIALS'
            );
        }

        const token = generateJWT(user);

        ctx.cookies.set('Authorization', token, { httpOnly: true });
        ctx.status = 200;
        ctx.body = { message: 'Login successful' };
    }

    async logoutUser(ctx: Context) {
        ctx.cookies.set('Authorization', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        ctx.status = 200;
        ctx.body = { message: 'Logout successful' };
    }

    async deleteUser(ctx: Context) {
        const userId = ctx.params.id;
        const isDeletedUser = await userService.deleteUser(userId);
        if (!isDeletedUser) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        ctx.status = 200;
        ctx.body = { message: 'User successfully deleted' };
    }
}

export default new UserController();
