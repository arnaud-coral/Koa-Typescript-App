import { Context } from 'koa';
import userService from '../services/userService';
import emailService from '../services/emailService';
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

interface UpdateUserProfileRequestBody {
    email?: string;
    username?: string;
}

class UserController {
    async registerUser(ctx: Context) {
        const { username, email, password } = ctx.request.body as RegisterRequestBody;

        const isUsernameTaken = await userService.isUsernameTaken(username);
        if (isUsernameTaken) {
            throw new HttpError('Username is already taken', 400, 'USERNAME_TAKEN');
        }

        const isEmailTaken = await userService.isEmailTaken(email);
        if (isEmailTaken) {
            throw new HttpError('Email is already registered', 400, 'EMAIL_REGISTERED');
        }

        const validationToken = emailService.generateEmailValidationToken();
        const user = await userService.registerUser(
            username,
            email,
            password,
            validationToken.token,
            validationToken.expiration
        );

        emailService.sendValidationEmail(user.email, validationToken.token);

        ctx.status = 201;
        ctx.body = { message: 'User successfully registered', user };
    }

    async loginUser(ctx: Context) {
        const { email, password } = ctx.request.body as LoginRequestBody;
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            throw new HttpError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
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
        const userId = ctx.state.user?.id;
        if (!userId) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        const isDeletedUser = await userService.deleteUser(userId);
        if (!isDeletedUser) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        ctx.cookies.set('Authorization', '', {
            httpOnly: true,
            expires: new Date(0),
        });
        ctx.status = 200;
        ctx.body = { message: 'User successfully deleted' };
    }

    async getUser(ctx: Context) {
        const userId = ctx.state.user?.id;
        if (!userId) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        const user = await userService.getUserById(userId);
        if (!user) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        ctx.status = 200;
        ctx.body = { message: 'User successfully fetched', user };
    }

    async updateUserProfile(ctx: Context) {
        const userId = ctx.state.user?.id;
        if (!userId) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        const updateData = ctx.request.body as UpdateUserProfileRequestBody;
        const currentUser = await userService.getUserById(userId);

        if (!currentUser) {
            throw new HttpError('User not found', 400, 'USER_NOT_FOUND');
        }

        if (updateData.username && updateData.username !== currentUser.username) {
            const usernameTaken = await userService.isUsernameTaken(updateData.username);
            if (usernameTaken) {
                throw new HttpError('Username is already in use', 400, 'USERNAME_TAKEN');
            }
        }

        let updatedUser;
        if (updateData.email && updateData.email !== currentUser.email) {
            const emailTaken = await userService.isEmailTaken(updateData.email);
            if (emailTaken) {
                throw new HttpError('Email is already in use', 400, 'EMAIL_TAKEN');
            }

            const validationToken = emailService.generateEmailValidationToken();

            updatedUser = await userService.updateUser(userId, {
                ...updateData,
                isEmailValidated: false,
                emailValidationToken: validationToken.token,
                tokenExpiration: validationToken.expiration,
            });

            emailService.sendValidationEmail(updateData.email, validationToken.token);
        } else {
            updatedUser = await userService.updateUser(userId, updateData);
        }

        ctx.status = 200;
        ctx.body = {
            message: 'User profile updated successfully',
            user: updatedUser,
        };
    }

    async updateUserPassword(ctx: Context) {
        ctx.status = 200;
        ctx.body = { message: 'Password updated successfully.' };
    }
}

export default new UserController();
