// Access token → very short
import jwt from "jsonwebtoken";
export const generateAccessToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.ACCESS_TOKEN_SECRET_KEY,
        { expiresIn: "5s" }   // 30 seconds
    );
   
};
console.log("AccessToken generated successfully");

// Refresh token → 1 minute
export const generateRefreshToken = (payload) => {
    return jwt.sign(
        payload,
        process.env.REFRESH_TOKEN_SECRET_KEY,
        { expiresIn: "10s" }
    );
};
