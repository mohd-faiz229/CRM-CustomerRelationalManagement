import express from "express";
import { asyncHandler } from "../Utils/asynchandler.js";
import { authController, checkOtpController, refreshAccessToken, getUserData } from "../Controller/authController.js";
import { authcheck } from "../MiddleWare/authCheck.middlewear.js";
import { errorHandler } from "../Utils/globalError.js";
import { authorizedRoles } from "../MiddleWare/authorizedRoles.js";


export const auth = express.Router();


auth.post("/login", asyncHandler(authController));
// Send OTP

auth.post("/otp-verify", asyncHandler(checkOtpController)); // Verify OTP

auth.post("/refresh", asyncHandler(refreshAccessToken))

auth.get("/user/:userid", asyncHandler(getUserData))

auth.get("/test/route", authcheck, authorizedRoles("hr"), async (req, res) => {
    try {
        res.send("You are unauthenticated")
    }


    catch (error) {
        throw new errorHandler(500, "Internal server error")

    }
})




