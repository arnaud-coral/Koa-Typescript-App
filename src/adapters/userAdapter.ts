import { Document } from 'mongoose';

interface User {
    username: string;
    email: string;
    isEmailValidated: boolean;
}

interface UserModel extends User, Document {

}

export function userAdapter(user: UserModel): User & { id: string } {
    return {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        isEmailValidated: user.isEmailValidated,
    };
}
