import express from "express";
import { createUserController } from "../Controller/admin.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { uploadMiddleware } from "../MiddleWare/upload.middleware.js"; // Import your multer config

const admin = express.Router();

// Order: 1. Route -> 2. Multer -> 3. AsyncHandler -> 4. Controller
admin.post(
    "/createUser",
    uploadMiddleware,
    asyncHandler(createUserController)
);

export { admin };