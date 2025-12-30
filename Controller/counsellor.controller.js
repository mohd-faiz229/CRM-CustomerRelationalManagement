
import { Employee } from "../Models/employee.schema.js"
import { Students } from "../Models/students.schema.js"
import { Courses } from "../Models/courses.schema.js";
import { customError } from "../Utils/customError.js"
import { success } from "../Utils/success.js"


// for creating new Student
const createStudent = async (req, res) => {
    const { userid } = req.params;
    const { name, gender, age, address, email, quallification, number, status, appliedCourse } = req.body;

    if (!userid) {
        return res.status(400).json({ status: "fail", message: "no user id" });
    }

    const user = await Employee.findById(userid);
    if (!user) {
        return res.status(404).json({ status: "fail", message: "user not found" });
    }

    const existingStudent = await Students.findOne({ email });
    if (existingStudent) {
        throw new customError(401, "Student already exists with this email");
    }

    const newStudent = await Students.create({
        name,
        email,
        address,
        gender,
        age,
        quallification,
        number,
        status,
        appliedCourse,
        counsellorDetail: user._id
    });

    user.students.push(newStudent._id);
    await user.save();

    success(res, 201, "Student Enrolled Successfully", newStudent);
};


// for fetching all students
const getAllStudents = async (req, res, next) => {
    try {
        // .find() gets everyone, .sort({createdAt: -1}) puts newest at the top
        const allStudents = await Students.find().sort({ createdAt: -1 });

        success(res, 200, "All students fetched successfully", allStudents);
    } catch (error) {
        next(error);
    }
};

// for deleting a student
const deleteStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const student = await Students.findByIdAndDelete(studentId);
        if (!student) {
            throw new customError(404, "Student not found");
        }
        success(res, 200, "Student deleted successfully", student);
    } catch (error) {
        next(error);
    }
};

// api for updating student details

const updateStudent = async (req, res, next) => {
    try {
        const { studentId } = req.params;
        const updateData = req.body;
        const updatedStudent = await Students.findByIdAndUpdate(studentId, updateData, { new: true });

        if (!updatedStudent) {
            throw new customError(404, "Student not found please check the ID or try again");
        }
        success(res, 200, "Student updated successfully", updatedStudent);
    } catch (error) {
        next(error);
    }
};

// delete student






    // ==== API'S FOR COURSE LISTING ====

    // for creating new Course

    const createCourse = async (req, res) => {

        const { courseName, courseDuration, courseFee, courseDescription, courseImage } = req.body;
        // get data from req body

        if (!courseName || !courseDuration || !courseFee || !courseDescription || !courseImage) {
            throw new customError(400, "All fields are required to create a course");
        }

        const newCourse = await Courses.create({
            courseName,
            courseDuration,
            courseFee,
            courseDescription,
            courseImage
        });

        success(res, 201, "Course Created Successfully", newCourse);
    }




    // getting all courses
    const getAllCourses = async (req, res, next) => {
        try {
            const allCourses = await Courses.find().sort({ createdAt: -1 });

            success(res, 200, "All courses fetched successfully", allCourses);
        }
        catch (error) {
            next(error);
        }
    };

    export { createStudent, getAllStudents, deleteStudent, updateStudent, createCourse, getAllCourses };







