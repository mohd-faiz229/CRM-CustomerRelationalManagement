import { Employee } from "../Models/employee.schema.js";
import bcrypt from "bcrypt";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";


const createUserController = async (req, res) => {


    const { name, email, phone, role, password } = req.body;

    if (!name || !email || !phone || !role || !password) {
        throw new customError(400, "All fields are required")
    }

    const user = await Employee.findOne({ email ,password});
    if (user) {
      
        throw new customError(401, "User already exists with this email. Please use another email.")
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Employee.create({
        name,
        email,
        phone,
        role,
        password: hashedPassword,
    });



    // res.status(201).json({  message: "User created successfully", user: newUser, });
    success(res, 201, "User Created Succcesfully",newUser)

};

export { createUserController };
