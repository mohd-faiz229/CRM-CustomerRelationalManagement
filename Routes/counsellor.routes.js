import express from "express";
import { asyncHandler } from "../Utils/asyncHandler.js";
import {
    createStudent, getAllStudents, deleteStudent, updateStudent, createCourse, getAllCourses, deleteCourse, updateCourse
} from "../Controller/counsellor.controller.js";
import { authCheck } from "../MiddleWare/authCheck.middlewear.js";
import { authorizedRoles } from "../MiddleWare/authorizedRoles.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage });


const counsellor = express.Router();

counsellor.post(
    "/student",
    authCheck,                     // ✅ verify access token

    authorizedRoles("counsellor", "admin"),
    // ✅ only counsellor allowed
    upload.single("studentImage"),
    asyncHandler(createStudent)
);


  


counsellor.get(
    "/students",
    authCheck,
    authorizedRoles("admin", "counsellor", "hr"),
    asyncHandler(getAllStudents)
);



counsellor.delete(
    "/student/:studentId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(deleteStudent)
);

counsellor.put(
    "/student/:studentId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(updateStudent)
);



counsellor.get(
    "/courses",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(getAllCourses)
);
counsellor.post(
    "/course",
    authCheck,
    authorizedRoles("counsellor", "admin"),
    upload.single("courseImage"),
    asyncHandler(createCourse)
);
counsellor.delete(
    "/course/:courseId",
    authCheck,
    authorizedRoles("admin","counsellor"),
    asyncHandler(deleteCourse)
);
counsellor.put(
    "/course/:courseId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    upload.single("courseImage"),
    asyncHandler(updateCourse)
);

export { counsellor };

