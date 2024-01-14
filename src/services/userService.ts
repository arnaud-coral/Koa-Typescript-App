import User from '../models/userModel';

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
}

export default new UserService();
