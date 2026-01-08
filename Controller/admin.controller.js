import { Employee } from "../Models/employee.schema.js";
import bcrypt from "bcrypt";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { uploadImage } from "../Config/cloudinary.js";

/* ================= CREATE USER ================= */

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
        name,
        email,
        phone,
        role,
        password: hashedPassword,
        profileImage,
    });

    return success(res, 201, "User created successfully", newUser);
};

/* ================= UPDATE USER ================= */
/* ================= UPDATE USER ================= */
const updateUserController = async (req, res) => {
    const { userId } = req.params;
    const { name, email, phone, role } = req.body;

    const user = await Employee.findById(userId);

    // FIXED: Added 'new' keyword
    if (!user) throw new customError(404, "User not found");

    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    // Handle File Upload if present
    if (req.file) {
        const uploadResult = await uploadImage(req.file.buffer, "crm_profiles");
        user.profileImage = {
            url: uploadResult.secure_url,
            public_id: uploadResult.public_id,
        };
    }

    await user.save();
    return success(res, 200, "User updated successfully", user);
};

/* ================= DELETE USER ================= */
const deleteUserController = async (req, res) => {
    const userId = req.params.userId;

    const user = await Employee.findByIdAndDelete(userId);
    if (!user) {
        // FIXED: Added 'new' keyword
        throw new customError(404, "User not found");
    }

    return success(res, 200, "User deleted successfully", user);
};

/* ================= GET ALL USERS ================= */

const getAllUsersController = async (req, res) => {
    const users = await Employee.find().sort({ createdAt: -1 });
    return success(res, 200, "All users fetched successfully", users);
};

export {
    createUserController,
    updateUserController,
    deleteUserController,
    getAllUsersController,
};
