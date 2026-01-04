import express from "express";
import { asyncHandler } from "../Utils/asyncHandler.js";
import {
    createStudent, getAllStudents, deleteStudent, updateStudent, createCourse, getAllCourses
} from "../Controller/counsellor.controller.js";
import { authCheck } from "../MiddleWare/authCheck.middlewear.js";
import { authorizedRoles } from "../MiddleWare/authorizedRoles.js";

const counsellor = express.Router();

counsellor.post(
    "/students/:userid",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(createStudent)
);

counsellor.get(
    "/students",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(getAllStudents)
);

counsellor.delete(
    "/students/:studentId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(deleteStudent)
);

counsellor.put(
    "/students/:studentId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(updateStudent)
);

counsellor.post(
    "/courses",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(createCourse)
);

counsellor.get(
    "/courses",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(getAllCourses)
);

export { counsellor };

