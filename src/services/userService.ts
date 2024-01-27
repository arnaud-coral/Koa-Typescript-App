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

    async updateUser(userId: string, updateData: any) {
        const user = await User.findByIdAndUpdate(userId, updateData, {
            new: true,
        });

        return user ? userAdapter(user) : null;
    }
}

export default new UserService();
