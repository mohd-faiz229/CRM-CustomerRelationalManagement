import express from "express";
import { asyncHandler } from "../Utils/asyncHandler.js";
import { createStudent ,getAllStudents,deleteStudent,updateStudent,createCourse,getAllCourses} from "../Controller/counsellor.controller.js";

const counsellor = express.Router();


// === Student Routes ===

// create student
counsellor.post("/createStudent/:userid", asyncHandler(createStudent));
// get all students
counsellor.get("/getAllStudents", asyncHandler(getAllStudents));
// delete student
counsellor.delete("/deleteStudent/:studentId", asyncHandler(deleteStudent));
// update student
counsellor.put("/updateStudent/:studentId", asyncHandler(updateStudent));

// === Courses Routes ===

// create course
counsellor.post("/createCourse", asyncHandler(createCourse));
// get all courses
counsellor.get("/getAllCourses", asyncHandler(getAllCourses));

export { counsellor };
