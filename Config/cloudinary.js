import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

// Upload helper
const uploadImage = async (fileBuffer, folder = "uploads") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { folder },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        ).end(fileBuffer);
    });
};

export { uploadImage };
export default cloudinary;
