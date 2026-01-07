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

const updateUserController = async (req, res) => {
    try {
        const { userId } = req.params;

        const {
            name,
            email,
            phone,
            role,
            profileImage, // 👈 accept it
        } = req.body;

        const user = await Employee.findById(userId);
        if (!user) {
            return customError(res, 404, "User not found");
        }

        // BASIC FIELDS
        if (name !== undefined) user.name = name;
        if (email !== undefined) user.email = email;
        if (phone !== undefined) user.phone = phone;
        if (role !== undefined) user.role = role;

        // IMAGE (defensive)
        if (profileImage) {
            user.profileImage = typeof profileImage === "string"
                ? { url: profileImage }
                : profileImage;
        }

        await user.save();

        return success(res, 200, "User updated successfully", user);
    } catch (err) {
        return customError(res, 500, err.message || "Update failed");
    }
};

const deleteUserController = async (req, res) => {
    const userId = req.params.userId;   
    const user = await Employee.findByIdAndDelete(userId);
    if (!user) {
        throw new customError(404, "User not found");
    }
    return success(res, 200, "User deleted successfully", user);    
};
const getAllUsersController = async (req, res) => {
    const users = await Employee.find().sort({ createdAt: -1 });
    return success(res, 200, "All users fetched successfully", users);
};

export { createUserController, updateUserController, deleteUserController, getAllUsersController };