import express from "express";
import cors from "cors";
import dbConnect from "./Database/dbConnect.js";
import { errorHandler } from "./Utils/globalError.js"
import { admin } from "./Routes/admin.routes.js";
import { auth } from "./Routes/authRoutes.js";
import { counsellor } from "./Routes/counsellor.routes.js"
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import requestLogger from "./MiddleWare/requestLogger.js";
import uploadRoutes from "./Routes/upload.routes.js"
import {limiter } from "./Config/ratelimiter.js"


const app = express();

dotenv.config()


// Middleware
app.use(express.json())
app.use(cors({
    origin: true,
    credentials: true
}));


// Database connection
dbConnect(

);


app.use(express.json());
app.use(cookieParser())




// winston log middleware
app.use(requestLogger)

// rate limiter
app.use(limiter)

//  all api route

app.use("/api/auth", auth);
app.use("/api/admin", admin);
app.use("/api/counsellor", counsellor)

// file upload route
app.use("/api", uploadRoutes);


app.use(errorHandler)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
