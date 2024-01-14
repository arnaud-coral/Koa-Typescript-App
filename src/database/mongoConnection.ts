import mongoose from 'mongoose';

const connectDB = async () => {
    const mongoUri =
        process.env.MONGO_URI || `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;

    try {
        await mongoose.connect(mongoUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);process.exit(1);
    }
};

export default connectDB;
