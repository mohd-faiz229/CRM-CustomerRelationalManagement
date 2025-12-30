import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_URl);
        console.log("database connected successfully")
    }
    catch (error) {
        console.error("Database connection failed:", error);
    }
}
export default dbConnect;

