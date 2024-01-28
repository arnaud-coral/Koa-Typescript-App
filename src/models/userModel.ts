import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isEmailValidated: { type: Boolean, default: false },
    emailValidationToken: { type: String, required: false },
    tokenExpiration: { type: Date, required: false },
    lastValidationRequest: { type: Date, required: false },
    loginAttempts: { type: Number, default: 0 },
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();
    if (update && 'password' in update) {
        const password = update.password;
        if (typeof password === 'string') {
            update.password = await bcrypt.hash(password, 10);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);

export default User;
