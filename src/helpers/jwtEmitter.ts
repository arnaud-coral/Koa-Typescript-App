import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import config from '../config/constants';

const JWT_SECRET = config.jwtSecret;
const NODE_ENV = config.nodeEnv;

interface User {
    _id: ObjectId;
}

export function generateJWT(user: User) {
    return jwt.sign({ userId: user._id }, JWT_SECRET, {
        expiresIn: NODE_ENV === 'local' ? '15m' : '24h',
    });
}
