import { Employee } from "../Models/employee.schema.js";
import bcrypt from "bcrypt";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { uploadImage } from "../Config/cloudinary.js";

const createUserController = async (req, res) => {
    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
        throw new customError(400, "All fields are required");
    }

    const userExists = await Employee.findOne({ email });
    if (userExists) {
        throw new customError(409, "User already exists with this email");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let profileImage = { url: "", public_id: "" };

    if (req.file) {
        const uploadResult = await uploadImage(
            req.file.buffer,
            "crm_profiles"
        );

        profileImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        };
    }

    const newUser = await Employee.create({
        name, email, phone,
        role, password: hashedPassword, profileImage,
    });

    return success(res, 201, "User created successfully", newUser);
};

export { createUserController };