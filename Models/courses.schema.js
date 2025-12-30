import mongoose from "mongoose";

const coursesSchema = new mongoose.Schema(
    {
        courseName: {
            type: String,
            required: true
        },
        courseDuration: {
            type: String,
            required: true
        },
        courseFee: {
            type: Number,
            required: true
        },
        courseDescription: {   // also fixed spelling
            type: String,
            required: true
        },
        courseImage: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

export const Courses = mongoose.model("Courses", coursesSchema);
