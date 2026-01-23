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

dotenv.config();

const app = express();

/* ---------- BASIC MIDDLEWARE ---------- */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ---------- CORS (LOCALHOST ONLY) ---------- */
app.use(
    cors({
        origin: "https://crm-customer-relational-management.vercel.app",
        credentials: true,
    })
);

/* ---------- ROUTES ---------- */
app.get("/", (req, res) => {
    res.send("Server running locally");
});

app.use("/api/auth", auth);
app.use("/api/admin", adminRouter);
app.use("/api/counsellor", counsellor);
app.use("/api", uploadRoutes);

/* ---------- ERROR HANDLER ---------- */
app.use(errorHandler);

/* ---------- START SERVER ---------- */
const PORT = 3000;

await dbConnect();
app.listen(PORT, () => {
    console.log(`✅ Server running at http://localhost:${PORT}`);
});

export default app;