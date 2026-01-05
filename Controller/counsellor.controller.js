import { Employee } from "../Models/employee.schema.js";
import { Students } from "../Models/students.schema.js";
import { Courses } from "../Models/courses.schema.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { uploadImage } from "../Config/cloudinary.js";

const createStudent = async (req, res) => {
    const userId = req.user.user;
    const role = req.user.role;

    const {
        name,
        gender,
        age,
        address,
        email,
        quallification, // renamed from 'quallification'
        number,
        status,
        appliedCourse,
        counsellorDetail // optional for admin
    } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !gender || !age || !address || !email || !quallification || !number || !appliedCourse) {
        throw new customError(400, "All required fields must be provided");
    }

    // 2️⃣ Check if student already exists
    const existingStudent = await Students.findOne({ email });
    if (existingStudent) {
        throw new customError(409, "Student already exists with this email");
    }

    // 3️⃣ Determine which counsellor to assign
    let assignedCounsellorId;
    if (role === "counsellor") {
        assignedCounsellorId = userId; // counsellor can only assign themselves
    } else if (role === "admin") {
        // admin can assign any counsellor or leave null
        assignedCounsellorId = counsellorDetail || null;
    } else {
        throw new customError(403, "Unauthorized role to create student");
    }

    // 4️⃣ Create the student
    const newStudent = await Students.create({
        name,
        gender,
        age,
        address,
        email,
        quallification,
        number,
        status: status || "pending",
        appliedCourse,
        counsellorDetail: assignedCounsellorId,
    });

    // 5️⃣ If a counsellor created it, push to their student list
    if (role === "counsellor") {
        const counsellor = await Employee.findById(userId);
        counsellor.students.push(newStudent._id);
        await counsellor.save();
    }

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
    const userId = req.user.user;
    const role = req.user.role;

    // 1️⃣ Check if student exists
    const student = await Students.findById(studentId);
    if (!student) {
        throw new customError(404, "Student not found");
    }

    // 2️⃣ Role-based authorization
    if (role === "counsellor" && String(student.counsellorDetail) !== userId) {
        throw new customError(403, "You are not authorized to update this student");
    }
    // Admin can update any student, no restriction

    // 3️⃣ Validate all required fields for PUT
    const {
        name,
        gender,
        age,
        address,
        email,
        quallification,
        number,
        status,
        appliedCourse
    } = req.body;

    if (!name || !gender || !age || !address || !email || !quallification || !number || !status || !appliedCourse) {
        throw new customError(400, "All fields are required for PUT update");
    }

    // 4️⃣ Update student
    const updatedStudent = await Students.findByIdAndUpdate(
        studentId,
        { name, gender, age, address, email, quallification, number, status, appliedCourse },
        { new: true }
    );

    return success(res, 200, "Student updated successfully", updatedStudent);
};

const createCourse = async (req, res) => {
    // Multer puts text fields in req.body and file in req.file
    const courseName = req.body.courseName;
    const courseDuration = req.body.courseDuration;
    const courseFee = req.body.courseFee;
    const courseDescription = req.body.courseDescription;

    if (!courseName || !courseDuration || !courseFee || !courseDescription || !req.file) {
        throw new customError(400, "All fields including course image are required");
    }

    // Upload image to Cloudinary
    const result = await uploadImage(req.file.buffer, "courses");

    // Create course
    const newCourse = await Courses.create({
        courseName,
        courseDuration,
        courseFee,
        courseDescription,
        courseImage: {
            url: result.secure_url
        }
    });

    return success(res, 201, "Course created successfully", newCourse);
};



const getAllCourses = async (req, res) => {
    const courses = await Courses.find().sort({ createdAt: -1 });
    return success(res, 200, "All courses fetched successfully", courses);
};


const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const course = await Courses.findByIdAndDelete(courseId);
    if (!course) {
        throw new customError(404, "Course not found");
    }
    return success(res, 200, "Course deleted successfully", course);
};const updateCourse = async (req, res) => {
    const { courseId } = req.params;            
    const { courseName, courseDuration, courseFee, courseDescription } = req.body;
    const course = await Courses.findById(courseId);
    if (!course) {
        throw new customError(404, "Course not found");
    }       
    course.courseName = courseName || course.courseName;
    course.courseDuration = courseDuration || course.courseDuration;
    course.courseFee = courseFee || course.courseFee;
    course.courseDescription = courseDescription || course.courseDescription;   
    await course.save();
    return success(res, 200, "Course updated successfully", course);    

};

export {
    createStudent,
    getAllStudents,
    
    deleteStudent,
    updateStudent,
    createCourse,
    getAllCourses,
    deleteCourse,
    updateCourse    

};