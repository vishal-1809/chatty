import mongoose from "mongoose";

const connectDB = async() => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("MongoDB connection error:", error);
    }
};

export default connectDB;

// https://www.youtube.com/watch?v=pdd04JzJrDw
// https://www.youtube.com/watch?v=ntKkVrQqBYY


// https://www.youtube.com/watch?v=tgO_ADSvY1I



// https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/67960148000b995c22c8