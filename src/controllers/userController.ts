import Koa from 'koa';
import userService from '../services/userService';
import { generateJWT } from '../helpers/jwtEmitter';

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

interface LoginRequestBody {
    email: string;
    password: string;
}

const registerUser = async (ctx: Koa.Context) => {
    try {
        const { username, email, password } = ctx.request
            .body as RegisterRequestBody;

        // Check if username is already taken
        const isUsernameTaken = await userService.isUsernameTaken(username);
        if (isUsernameTaken) {
            ctx.status = 400;
            ctx.body = { message: 'Username is already taken' };
            return;
        }

        // Check if email is already taken
        const isEmailTaken = await userService.isEmailTaken(email);
        if (isEmailTaken) {
            ctx.status = 400;
            ctx.body = { message: 'Email is already registered' };
            return;
        }

        // Register the user if username and email are not taken
        const user = await userService.registerUser(username, email, password);

        ctx.status = 201;
        ctx.body = {
            message: 'User successfully registered',
            userId: user._id,
        };
    } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        ctx.status = 400;
        ctx.body = { message: errorMessage };
    }
};

const loginUser = async (ctx: Koa.Context) => {
    try {
        const { email, password } = ctx.request.body as LoginRequestBody;

        // Authenticate the user
        const user = await userService.authenticateUser(email, password);
        if (!user) {
            ctx.status = 401;
            ctx.body = { message: 'Invalid email or password' };
            return;
        }

        const token = generateJWT(user);

        ctx.cookies.set('Authorization', token, { httpOnly: true });

        ctx.status = 200;
        ctx.body = { message: 'Login successful' };
    } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        ctx.status = 500;
        ctx.body = { message: errorMessage };
    }
};

const deleteUser = async (ctx: Koa.Context) => {
    try {
        const userId = ctx.params.id;
        await userService.deleteUser(userId);
        ctx.status = 200;
        ctx.body = { message: 'User successfully deleted' };
    } catch (error) {
        let errorMessage = 'An unknown error occurred';
        if (error instanceof Error) {
            errorMessage = error.message;
        }

        ctx.status = 500;
        ctx.body = { message: errorMessage };
    }
};

export { registerUser, loginUser, deleteUser };
