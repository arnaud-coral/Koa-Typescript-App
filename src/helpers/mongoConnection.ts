import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri =
        process.env.MONGO_URI || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
    try {
        await mongoose.connect(mongoUri);
    } catch (error) {
        const errorMessage = (error as Error).message;
        throw new Error(`MongoDB connection error: ${errorMessage}`);
    }
};

export default connectDB;
