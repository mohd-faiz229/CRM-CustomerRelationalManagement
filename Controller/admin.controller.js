import { Employee } from "../Models/employee.schema.js";
import bcrypt from "bcrypt";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
// fs is no longer needed for memory storage
import { uploadImage } from "../Config/cloudinary.js";

const createUserController = async (req, res) => {
    try {
        // 1. Destructure text fields
        // Because of the uploadMiddleware in your route, req.body is now populated
        const { name, email, phone, role, password } = req.body;

        if (!name || !email || !phone || !role || !password) {
            throw new customError(400, "All fields are required");
        }

        const userExists = await Employee.findOne({ email });
        if (userExists) {
            throw new customError(
                409,
                "User already exists with this email. Please use another email."
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        let profileImage = {
            url: "",
            public_id: "",
        };

        // 2. Upload image using BUFFER
        if (req.file) {
            // Use req.file.buffer (from memoryStorage) instead of req.file.path
            const uploadResult = await uploadImage(req.file.buffer, "crm_profiles");

            profileImage = {
                url: uploadResult.secure_url,
                public_id: uploadResult.public_id,
            };

            // 3. REMOVED: fs.unlinkSync(req.file.path) 
            // Files aren't stored on disk, so no cleanup is needed!
        }

        const newUser = await Employee.create({
            name,
            email,
            phone,
            role,
            password: hashedPassword,
            profileImage,
        });

        success(res, 201, "User Created Successfully", newUser);
    } catch (error) {
        // Handle both customErrors and standard errors
        res.status(error.statusCode || 500).json({
            message: error.message || "Internal Server Error",
        });
    }
};

export { createUserController };