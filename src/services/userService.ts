import bcrypt from 'bcryptjs';
import User from '../models/userModel';
import { userAdapter } from '../adapters/userAdapter';

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
            await User.updateOne(
                { _id: user._id },
                { $inc: { loginAttempts: 1 } }
            );
            return false;
        }

        await User.updateOne({ _id: user._id }, { $set: { loginAttempts: 0 } });
        return user;
    }

    async isAccountLocked(email: string) {
        const user = await User.findOne({ email });
        return user && user.loginAttempts >= 5;
    }

    async isCurrentPasswordMatching(userId: string, password: string) {
        const user = await User.findById(userId);
        if (!user) {
            return false;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return false;
        }

        return true;
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

    async updateUser(userId: string, updateData: any) {
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        });

        return user ? userAdapter(user) : null;
    }

    async canRequestValidationLink(userId: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const lastRequested = user.lastValidationRequest;
        if (
            lastRequested &&
            new Date().getTime() - new Date(lastRequested).getTime() <
                15 * 60 * 1000
        ) {
            return false;
        }

        return true;
    }

    async isEmailValidated(userId: string): Promise<boolean> {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        const isEmailValidated = user.isEmailValidated;
        if (isEmailValidated) {
            return true;
        }

        return false;
    }

    async updateValidationToken(
        userId: string,
        token: string,
        expiration: Date
    ) {
        await User.findByIdAndUpdate(userId, {
            emailValidationToken: token,
            tokenExpiration: expiration,
            lastValidationRequest: new Date(),
        });
    }
}

export default new UserService();
