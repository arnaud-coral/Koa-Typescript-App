import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';

interface User {
    _id: ObjectId;
}

export function generateJWT(user: User) {
    const secretKey =
        process.env.JWT_SECRET ||
        'NgYRotemandeOmEterOmEkInTeXurynCEmITORIneUMpoRymphMBionOmYcEspOtembroFAularanUTiOnAilDoXAnDERmEAHesp';

    return jwt.sign({ userId: user._id }, secretKey, {
        expiresIn: process.env.NODE_ENV === 'local' ? '15m' : '24h',
    });
}
