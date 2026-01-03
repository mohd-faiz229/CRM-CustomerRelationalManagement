import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
mongoose.set("bufferCommands", false);


const dbConnect = async () => {
    if (mongoose.connections.readyState===1) {
        console.log(" MongoDB already connected");
        return;
    }

    try {
        await mongoose.connect(process.env.DB_URL); // no options needed in Mongoose v7+
        console.log("✅ MongoDB connected successfully");
    } catch (error) {
        console.error("❌ Database connection failed:", error);
        throw error; // important for serverless or local debugging
    }
};

export default dbConnect;
