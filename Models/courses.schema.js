import mongoose from "mongoose";


const coursesSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true,
            trim: true
        },
        courseDuration: {
            type: String,
            required: true
        },
        courseFee: {
            type: Number,
            required: true
        },
        courseDescription: {
            type: String,
            required: true
        },
        courseImage: {
            type: String,
            
            required: true
        }

    },
    { timestamps: true }
);

export const Courses = mongoose.model("Courses", coursesSchema);
