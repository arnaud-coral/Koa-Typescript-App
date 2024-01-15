import User from '../models/userModel';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcryptjs';

class UserService {
    async isUsernameTaken(username: string) {
        const existingUser = await User.findOne({ username });

        return !!existingUser;
    }

    async isEmailTaken(email: string) {
        const existingUser = await User.findOne({ email });

        return !!existingUser;
    }

    async registerUser(username: string, email: string, password: string) {
        const user = new User({ username, email, password });
        await user.save();

        return user;
    }

    async authenticateUser(email: string, password: string) {
        const user = await User.findOne({ email });
        if (!user) {
            return null;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return null;
        }

        return user;
    }

    async deleteUser(userId: string) {
        const result = await User.findByIdAndDelete(userId);
        if (!result) {
            throw new Error('User not found');
        }
    }
}

export default new UserService();