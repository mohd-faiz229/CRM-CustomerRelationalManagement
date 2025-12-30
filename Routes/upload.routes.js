import express from "express";
import { uploadMiddleware } from "../MiddleWare/upload.middleware.js";
import cloudinary from "../Config/cloudinary.js";
import fs from "fs";

const router = express.Router();

router.post("/upload", uploadMiddleware, async (req, res) => {
    try {
        // Upload file from local folder to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "crm_uploads", // optional folder in Cloudinary
        });

        // Delete local file after upload (optional)
        fs.unlinkSync(req.file.path);

        res.status(200).json({
            message: "File uploaded to Cloudinary successfully",
            url: result.secure_url,
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

export default router;
