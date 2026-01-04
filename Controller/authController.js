import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Employee } from "../Models/employee.schema.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { generateAccessToken, generateRefreshToken } from "../Utils/tokens.js";
import { sendEmail } from "../Services/email.service.js";
import { otpEmailTemplate } from "../Templates/otp.template.js";

const authController = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new customError(400, "Email and password required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await Employee.findOne({ email: normalizedEmail });

    if (!user) {
        throw new customError(404, "Account not found");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if (!isMatched) {
        throw new customError(400, "Invalid credentials");
    }

    if (!user.isVerified) {
        const otp = String(Math.floor(10000 + Math.random() * 90000));
        user.otp = otp;
        await user.save();

        const emailHtml = otpEmailTemplate().replace("{otp}", otp);

        await sendEmail(
            normalizedEmail,
            "OTP Verification - CRM",
            emailHtml
        );

        return success(res, 200, "OTP sent for verification", {
            email: normalizedEmail,
        });
    }

    const payload = { user: user._id, role: user.role };
    const accessToken = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, 200, "Login successful", {
        accessToken,
        user: {
            _id: user._id,
            name: user.name,
            role: user.role.trim(),
        },
    });
};

const checkOtpController = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        throw new customError(400, "Email and OTP required");
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await Employee.findOne({ email: normalizedEmail });

    if (!user) {
        throw new customError(404, "User not found");
    }

    if (user.otp !== otp) {
        throw new customError(400, "Invalid OTP");
    }

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
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return success(res, 200, "OTP verified successfully", {
        accessToken,
        role: user.role.trim(),
    });
};

const refreshAccessToken = async (req, res) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        throw new customError(401, "Authentication required");
    }

    try {
        const decoded = jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET_KEY
        );

        const newAccessToken = generateAccessToken({
            user: decoded.user,
            role: decoded.role,
        });

        return success(res, 200, "Access token refreshed", {
            accessToken: newAccessToken,
        });
    } catch (error) {
        const decoded = jwt.decode(refreshToken);

        if (decoded?.user) {
            await Employee.findByIdAndUpdate(decoded.user, {
                isVerified: false,
                otp: null,
            });
        }

        throw new customError(
            401,
            "Session expired. Please verify again via OTP."
        );
    }
};

const getUserData = async (req, res) => {
    const { userid } = req.params;

    if (!userid) {
        throw new customError(400, "User ID required");
    }

    const user = await Employee.findById(userid).populate("students");

    if (!user) {
        throw new customError(404, "User not found");
    }

    return success(res, 200, "User data fetched", {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        students: user.students,
    });
};

export { authController, checkOtpController, refreshAccessToken, getUserData };