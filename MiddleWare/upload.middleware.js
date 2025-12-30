import path from "path";
import multer from "multer";


// Set storage folder and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // your uploads folder
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    }
});
export const upload = multer({ storage });
export const uploadMiddleware = upload.single("file"); 
