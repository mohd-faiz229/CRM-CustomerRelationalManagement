import express from "express";
import { createUserController } from "../Controller/admin.controller.js";
import { asyncHandler } from "../Utils/asynchandler.js";

// Admin router
const admin = express.Router();

// Create user route
admin.post("/createUser", asyncHandler(createUserController) );

// Export router
export { admin };









