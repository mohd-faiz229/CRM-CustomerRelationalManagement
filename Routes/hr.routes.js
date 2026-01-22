import express from "express";
import { asyncHandler } from "../Utils/asyncHandler.js";
import {
     getAllStudents, getAllCourses,
} from "../Controller/counsellor.controller.js";
import { authCheck } from "../MiddleWare/authCheck.middlewear.js";
import { authorizedRoles } from "../MiddleWare/authorizedRoles.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });

const hr = express.Router();
hr.get(
    "/getAllStudent=",
    authCheck,      
    authorizedRoles("hr"),
    upload.single("studentImage"),
    asyncHandler(getAllStudents)
);
hr.get(
    "/getAllCourses",
    authCheck,      
    authorizedRoles("hr"),
    upload.single("courseImage"),
    asyncHandler(getAllCourses)
);
export { hr };
