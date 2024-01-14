import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import connectDB from '../../src/helpers/mongoConnection';

describe('MongoDB Connection', () => {
    let mongoServer: MongoMemoryServer;

    beforeAll(async () => {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        process.env.MONGO_URI = mongoUri;
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    test('should establish a successful connection with MongoDB', async () => {
        await expect(connectDB()).resolves.not.toThrow();
    });
});
