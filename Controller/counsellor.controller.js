import { Employee } from "../Models/employee.schema.js";
import { Students } from "../Models/students.schema.js";
import { Courses } from "../Models/courses.schema.js";
import { customError } from "../Utils/customError.js";
import { success } from "../Utils/success.js";
import { uploadImage } from "../Config/cloudinary.js";

/** * STUDENT MANAGEMENT 
 */
const createStudent = async (req, res) => {
    const userId = req.user.user;
    const role = req.user.role;

    const {
        name, gender, age, address, email,
        quallification, number, status,
        appliedCourse, counsellorDetail
    } = req.body;

    if (!name || !gender || !age || !address || !email || !quallification || !number || !appliedCourse) {
        throw new customError(400, "All required fields must be provided");
    }

    const existingStudent = await Students.findOne({ email });
    if (existingStudent) {
        throw new customError(409, "Student already exists with this email");
    }

    let assignedCounsellorId = (role === "counsellor") ? userId : (counsellorDetail || null);

    const newStudent = await Students.create({
        name: name.trim(),
        gender,
        age: Number(age),
        address: address.trim(),
        email: email.toLowerCase().trim(),
        quallification,
        number,
        status: status || "pending",
        appliedCourse,
        counsellorDetail: assignedCounsellorId,
    });

    if (role === "counsellor") {
        await Employee.findByIdAndUpdate(userId, { $push: { students: newStudent._id } });
    }

    return success(res, 201, "Student enrolled successfully", newStudent);
};

const getAllStudents = async (req, res) => {
    const students = await Students.find().sort({ createdAt: -1 });
    return success(res, 200, "All students fetched successfully", students);
};

const updateStudent = async (req, res) => {
    const { studentId } = req.params;
    const userId = req.user.user;
    const role = req.user.role;

    const student = await Students.findById(studentId);
    if (!student) throw new customError(404, "Student not found");

    if (role === "counsellor" && String(student.counsellorDetail) !== userId) {
        throw new customError(403, "Access Denied: You do not manage this student");
    }

    const updatedStudent = await Students.findByIdAndUpdate(
        studentId,
        { $set: req.body }, // Dynamic update to avoid "PUT" requirement bloat
        { new: true, runValidators: true }
    );

    return success(res, 200, "Student record updated", updatedStudent);
};

const deleteStudent = async (req, res) => {
    const { studentId } = req.params;
    const { role, user: userId } = req.user;

    const student = await Students.findById(studentId);
    if (!student) throw new customError(404, "Student not found");

    // Brutal Check: Prevent counsellors from deleting students they don't own
    if (role === "counsellor" && String(student.counsellorDetail) !== userId) {
        throw new customError(403, "Unauthorized purge attempt");
    }

    await Students.findByIdAndDelete(studentId);
    return success(res, 200, "Student removed from system");
};

/** * COURSE MANAGEMENT 
 */
const createCourse = async (req, res) => {
    const { courseName, courseDuration, courseFee, courseDescription } = req.body;

    if (!courseName || !courseDuration || !courseFee || !courseDescription) {
        throw new customError(400, "Incomplete course data");
    }

    if (!req.file) throw new customError(400, "Visual assets required for courses");

    const uploadResult = await uploadImage(req.file.buffer, "courses");

    const newCourse = await Courses.create({
        courseName: courseName.trim(),
        courseDuration: courseDuration.trim(),
        courseFee: Number(courseFee),
        courseDescription: courseDescription.trim(),
        courseImage: uploadResult.secure_url
    });

    return success(res, 201, "Course published", newCourse);
};

const getAllCourses = async (req, res) => {
    const courses = await Courses.find().sort({ createdAt: -1 });
    return success(res, 200, "Curriculum fetched", courses);
};

const updateCourse = async (req, res) => {
    const { courseId } = req.params;
    const { courseName, courseDuration, courseFee, courseDescription } = req.body;

    const course = await Courses.findById(courseId);
    if (!course) throw new customError(404, "Course not found");

    if (courseName) course.courseName = courseName.trim();
    if (courseDuration) course.courseDuration = courseDuration.trim();
    if (courseFee) course.courseFee = Number(courseFee); // Ensure numeric type
    if (courseDescription) course.courseDescription = courseDescription.trim();

    await course.save();
    return success(res, 200, "Course synchronized", course);
};

const deleteCourse = async (req, res) => {
    const { courseId } = req.params;
    const course = await Courses.findByIdAndDelete(courseId);
    if (!course) throw new customError(404, "Course not found");

    return success(res, 200, "Course purged");
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