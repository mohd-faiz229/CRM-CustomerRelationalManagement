import multer from "multer";

// 1. Initialize memory storage
// No options needed inside the parentheses for memoryStorage
const storage = multer.memoryStorage();

// 2. Define a File Filter
// This prevents users from uploading non-image files (like PDFs or scripts)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed!"), false);
    }
};

// 3. Configure Multer with limits and filters
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // Limit size to 5MB
    }
});

// 4. Export the specific middleware
// "file" must match the Key name you use in Postman/Thunder Client
export const uploadMiddleware = upload.single("file");