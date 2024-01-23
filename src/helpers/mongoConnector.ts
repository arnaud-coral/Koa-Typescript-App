import mongoose from 'mongoose';
import config from '../config/constants';

const MONGO_HOST = config.mongoHost;
const MONGO_PORT = config.mongoPort;
const MONGO_DB = config.mongoDb;

const connectDB = async () => {
    const mongoUri = `mongodb://${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;
    try {
        await mongoose.connect(mongoUri);
    } catch (error) {
        const errorMessage = (error as Error).message;
        throw new Error(`MongoDB connection error: ${errorMessage}`);
    }
};

export default connectDB;
