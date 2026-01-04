import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import dbConnect from "./Database/dbConnect.js";
import { errorHandler } from "./Utils/globalError.js";

import { adminRouter } from "./Routes/admin.routes.js";
import { auth } from "./Routes/authRoutes.js";
import { counsellor } from "./Routes/counsellor.routes.js";
import uploadRoutes from "./Routes/upload.routes.js";

import requestLogger from "./MiddleWare/requestLogger.js";
import { limiter } from "./Config/ratelimiter.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
    cors({
        origin: true,
        credentials: true,
    })
);

app.use(requestLogger);
app.use(limiter);

app.get("/", (req, res) => {
    res.send("Server is running");
});

app.use("/api/auth", auth);
app.use("/api/admin", adminRouter);
app.use("/api/counsellor", counsellor);
app.use("/api", uploadRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

try {
    await dbConnect();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
} catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
}

export default app;
