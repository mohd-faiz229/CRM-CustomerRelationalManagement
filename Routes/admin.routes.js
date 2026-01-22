import express from "express";
// Rename the import to be specific about what it is (e.g., adminController)

import { createUserController, updateUserController, deleteUserController, getAllUsersController, getUserByIdController } from "../Controller/admin.controller.js";
import { authCheck } from "../MiddleWare/authCheck.middlewear.js";
import { authorizedRoles } from "../MiddleWare/authorizedRoles.js";
import { createCourse, getAllCourses, deleteStudent, updateCourse, deleteCourse, createStudent, updateStudent, getAllStudents } from "../Controller/counsellor.controller.js";
import { asyncHandler } from "../Utils/asyncHandler.js";
const adminRouter = express.Router(); // Use a distinct name for the router
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });
// Now the distinction is clear:


// ===User Management Routes===
adminRouter.post(
    "/user",
    authCheck,
    authorizedRoles("admin"),
    upload.single("profileImage"),

    asyncHandler(createUserController) // Use the imported controller here
);
adminRouter.put(
    "/user/:userId",
    authCheck,

    authorizedRoles("admin"),
    upload.single("profileImage"),

    asyncHandler(updateUserController)
);
adminRouter.get(
    "/users",
    authCheck,
    authorizedRoles("admin"),
    asyncHandler(getAllUsersController)
);

adminRouter.get(
    "/user/:userId",
    authCheck,
    authorizedRoles("admin"),
    asyncHandler(getUserByIdController)
);
adminRouter.delete(
    "/user/:userId",
    authCheck,
    authorizedRoles("admin"),
    asyncHandler(deleteUserController)
);

// ===Student Routes===
adminRouter.post(
    "/student",
    authCheck,
    authorizedRoles("admin", "counsellor"),

    asyncHandler(createStudent)
);

adminRouter.delete(
    "/student/:studentId",
    authCheck,
    authorizedRoles("admin"),
    asyncHandler(deleteStudent)
);
adminRouter.put(
    "/student/:studentId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(updateStudent)
);
adminRouter.get(
    "/students",
    authCheck,
    authorizedRoles("admin", "counsellor", "hr"),
    asyncHandler(getAllStudents)
);
// === Course Management Routes ===
adminRouter.post(
    "/course",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    upload.single("courseImage"),
    asyncHandler(createCourse)
);

adminRouter.get(
    "/courses",
    authCheck,
    authorizedRoles("admin"),
    asyncHandler(getAllCourses)
);

adminRouter.put(
    "/course/:courseId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(updateCourse)
);
adminRouter.delete(
    "/course/:courseId",
    authCheck,
    authorizedRoles("admin", "counsellor"),
    asyncHandler(deleteCourse)
);


export { adminRouter };