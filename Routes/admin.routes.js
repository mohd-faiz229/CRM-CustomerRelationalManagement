import express from "express";
// Rename the import to be specific about what it is (e.g., adminController)

import { createUserController } from "../Controller/admin.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js";    
const adminRouter = express.Router(); // Use a distinct name for the router

// Now the distinction is clear:
adminRouter.post(
    "/createUser",
   
    asyncHandler(createUserController) // Use the imported controller here
);

export { adminRouter };