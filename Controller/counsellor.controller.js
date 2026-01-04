import { Employee } from "../Models/employee.schema.js";
import { Students } from "../Models/students.schema.js";
import { Courses } from "../Models/courses.schema.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";

const createStudent = async (req, res) => {
    const { userid } = req.params;
    const { name, gender, age, address, email, quallification,
        number, status, appliedCourse } = req.body;

    if (!userid) {
        throw new customError(400, "User ID is required");
    }

    const user = await Employee.findById(userid);
    if (!user) {
        throw new customError(404, "User not found");
    }

    const existingStudent = await Students.findOne({ email });
    if (existingStudent) {
        throw new customError(409, "Student already exists with this email");
    }

    const newStudent = await Students.create({
        name, email, address, gender, age,
        quallification, number, status, appliedCourse,
        counsellorDetail: user._id,
    });

    user.students.push(newStudent._id);
    await user.save();

    return success(res, 201, "Student enrolled successfully", newStudent);
};

const getAllStudents = async (req, res) => {
    const students = await Students.find().sort({ createdAt: -1 });
    return success(res, 200, "All students fetched successfully", students);
};

const deleteStudent = async (req, res) => {
    const { studentId } = req.params;

    const student = await Students.findByIdAndDelete(studentId);
    if (!student) {
        throw new customError(404, "Student not found");
    }

    return success(res, 200, "Student deleted successfully", student);
};

const updateStudent = async (req, res) => {
    const { studentId } = req.params;

    const updatedStudent = await Students.findByIdAndUpdate(
        studentId,
        req.body,
        { new: true }
    );

    if (!updatedStudent) {
        throw new customError(404, "Student not found");
    }

    return success(res, 200, "Student updated successfully", updatedStudent);
};

const createCourse = async (req, res) => {
    const {
        courseName,
        courseDuration,
        courseFee,
        courseDescription,
        courseImage,
    } = req.body;

    if (
        !courseName ||
        !courseDuration ||
        !courseFee ||
        !courseDescription ||
        !courseImage
    ) {
        throw new customError(400, "All fields are required to create a course");
    }

    const newCourse = await Courses.create({
        courseName,
        courseDuration,
        courseFee,
        courseDescription,
        courseImage,
    });

    return success(res, 201, "Course created successfully", newCourse);
};

const getAllCourses = async (req, res) => {
    const courses = await Courses.find().sort({ createdAt: -1 });
    return success(res, 200, "All courses fetched successfully", courses);
};

export {
    createStudent,
    getAllStudents,
    deleteStudent,
    updateStudent,
    createCourse,
    getAllCourses,

};