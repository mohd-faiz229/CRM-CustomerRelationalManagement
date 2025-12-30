import  mongoose from "mongoose";

const studentSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true

    },
    age: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
   
    quallification: {
        type: String,
        required: true
    },
    number: {
        type: String,
        required: true
    },
    appliedCourse: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "active", "graduated", "dropped"], // Only these values allowed
        default: "pending" // Automatically sets to pending if you don't provide one
    },

    
    counsellorDetail: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee",
        default:null
    }
}, { timestamps: true })
export const Students = mongoose.model("Students", studentSchema);