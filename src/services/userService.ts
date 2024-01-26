import User from '../models/userModel';
import { userAdapter } from '../adapters/userAdapter';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import emailService from './emailService';
import config from '../config/constants';

const VALIDATION_LINK = config.validationLink;

class UserService {
    async isUsernameTaken(username: string) {
        const existingUser = await User.findOne({ username });

        return !!existingUser;
    }

    async isEmailTaken(email: string) {
        const existingUser = await User.findOne({ email });

        return !!existingUser;
    }

    async registerUser(
        username: string,
        email: string,
        password: string,
        emailValidationToken: string,
        tokenExpiration: Date
    ) {
        const user = new User({
            username,
            email,
            password,
            emailValidationToken,
            tokenExpiration,
        });
        await user.save();

        return userAdapter(user);
    }

    generateValidationToken() {
        const token = crypto.randomBytes(20).toString('hex');
        const expiration = new Date();
        expiration.setHours(expiration.getHours() + 24);
        return { token, expiration };
    }

    sendValidationEmail(email: string, token: string) {
        const validationLink = `${VALIDATION_LINK}${token}`;
        emailService.sendEmail(
            email,
            'Email Validation',
            `Please validate your email: ${validationLink}`
        );
    }

    async validateToken(token: string) {
        const user = await User.findOne({
            emailValidationToken: token,
            tokenExpiration: { $gt: new Date() },
        });
        if (!user) return null;

        user.isEmailValidated = true;
        user.emailValidationToken = undefined;
        user.tokenExpiration = undefined;
        await user.save();

        return user;
    }

    async authenticateUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            return false;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return false;
        }

        return user;
    }

    async deleteUser(userId: string) {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            return false;
        }

        return true;
    }

    async getUserById(userId: string) {
        const user = await User.findById(userId);

        return user ? userAdapter(user) : null;
    }
}

export default new UserService();
