import { Employee } from "../Models/employee.schema.js";
import { otpEmailTemplate } from "../Templates/otp.template.js";
import { sendEmail } from "../Services/email.service.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import jwt from "jsonwebtoken";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokens.js";
import bcrypt from "bcrypt"


// Controller to handle login (send OTP)
// Controller to handle login (send OTP)
const authController = async (req, res) => {
    console.log("🔥 LOGIN CONTROLLER HIT");


    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError(400, "email and password is required");
    }



    const normalizedEmail = email.trim().toLowerCase();

    const user = await Employee.findOne({ email: normalizedEmail });
    console.log("STEP 1: USER FOUND →", user ? true : false);


    if (!user) {
        throw new customError(404, "User does not exist");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    console.log("STEP 2: PASSWORD VALID →", isMatched);

    if (!isMatched) {
        throw new customError(400, "Invalid credentials");
    }
    console.log("STEP 3: user.isVerified →", user.isVerified);

    // If already verified → login directly
    if (user.isVerified === true) {

        const payload = { user: user._id, role: user.role };

        const accessToken = generateAccessToken(payload);
        const refreshToken = generateRefreshToken(payload);

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 60 * 1000, // 1 minute
        });

        return success(res, 200, "Login Successful", {
            userid: user._id,
            accessToken,
            role: user.role.trim()
        });
    }

    // Generate OTP (store as STRING)
    const otp = String(Math.floor(1000 + Math.random() * 9000));

    const content = otpEmailTemplate().replace("{otp}", otp);
    await sendEmail(normalizedEmail, "OTP Verification", content);

    user.otp = otp;
    await user.save();

    return success(res, 201, "OTP sent successfully", {
        email: normalizedEmail   // 👈 IMPORTANT
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

    if (!user.otp) {
        throw new customError(400, "OTP expired or already used");
    }

    // Compare STRING to STRING
    if (user.otp !== String(otp)) {
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
        secure: false,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
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
    const { refreshToken } = req.cookies
    console.log(refreshToken)

    if (!refreshToken) {
        throw new customError(400, "Refresh Token ")
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY)

    if (!decoded) {
        throw new customError(403, "Refresh Token Expired")
    }



    const payload = { userid: decoded.user, role: decoded.role }

    const newAccessToken = generateAccessToken(payload)

    success(res, 200, "new access token generated", newAccessToken)

}

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
