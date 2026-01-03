import { Employee } from "../Models/employee.schema.js";
import { otpEmailTemplate } from "../Templates/otp.template.js";
import { sendEmail } from "../Services/email.service.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokens.js";
import bcrypt from "bcrypt"

const authController = async (req, res) => {
    console.log("🔥 LOGIN CONTROLLER HIT");

    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError(400, "Email and password are required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Case-insensitive query for safety
    const user = await Employee.findOne({ email: normalizedEmail });
    console.log("STEP 1: USER FOUND →", !!user);

    if (!user) {
        throw new customError(404, "No account found with this email");
    }


    const isMatched = await bcrypt.compare(password, user.password);
    console.log(isMatched)
    console.log("STEP 2: PASSWORD VALID →", isMatched);

    if (!isMatched) {
        throw new customError(400, "Invalid credentials");
    }

    console.log("STEP 3: user.isVerified →", user.isVerified);

    // Already verified → login directly
    if (user.isVerified) {
        const payload = { user: user._id, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 1000, // 1 minute
            secure: true, // set to true if using HTTPS
        });
        return success(res, 200, "Login Successful", {
            accessToken,
            user: {
                _id: user._id,
                name: user.name,
                role: user.role.trim(),
                profileImage: user.profileImage || { url: "" }
            }
        });
    }

    // Generate OTP (store as string)
    const otp = String(Math.floor(1000 + Math.random() * 9000));
    // const content = otpEmailTemplate().replace("{otp}", otp);
    // await sendEmail(normalizedEmail, "OTP Verification", content);

    user.otp = otp;
    user.isVerified = false;
    await user.save();

    return success(res, 201, "OTP sent successfully", {
        email: normalizedEmail, // Send normalized email
    });
};






// Controller to verify OTP
const checkOtpController = async (req, res) => {

    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new customError(400, "Email and OTP is required");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await Employee.findOne({ email: normalizedEmail });

    if (!user) {
        throw new customError(404, "User not found");
    }

   

    if (user.otp !== otp) {
        throw new customError(400, "Invalid OTP");
    }

    // Mark verified
    user.otp = null;
    user.isVerified = true;

    await user.save();

    const payload = { user: user._id, role: user.role };

    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,

        secure: true,
        sameSite: "lax",
        maxAge: 60 * 1000 // 1 minute (TESTING ONLY)

    });
    console.log({
        receivedEmail: email,
        normalizedEmail,
        storedOtp: user?.otp,
        receivedOtp: otp
    });

    return success(res, 200, "OTP verified successfully", {
        accessToken,
        userid: user._id,
        role: user.role.trim()
    });


};


const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new customError(401, "Authentication required");
    }

    let decoded;
    try {
        decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );
    } catch (err) {
        throw new customError(401, "Session expired. Please login again.");
    }

    const payload = {
        user: decoded.user,
        role: decoded.role,
    };

    const newAccessToken = generateAccessToken(payload);

    return success(res, 200, "Access token refreshed", {
        accessToken: newAccessToken,
    });
};


// getting  user data for displaying on frontend

const getUserData = async (req, res) => {
    const { userid } = req.params

    if (!userid) {
        throw new customError(400, "no user id found")
    }


    const userDetails = await Employee.findById(userid).populate("students");

    if (!userDetails) {
        throw new customError(400, "No user found")
    }

    const data = {
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        role: userDetails.role,
        Students: userDetails.students

    }

    success(res, 200, "User data fetched successfully", data)


}

export { authController, checkOtpController, refreshAccessToken, getUserData };
