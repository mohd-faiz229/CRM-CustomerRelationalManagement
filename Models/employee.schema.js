import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        password: {
            type: String,
            required: true,
        },

        role: {
            type: String,
            required: true,
        },

        otp: {
            type: Number,
            default: null,
        },

        isVerified: {
            type: Boolean,
            default: false,
        },

        profile: {
            type: String,
        },

        phone: {
            type: String,
            required: true,
        },
        students: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Students",
                default: null
            }
        ],
        profilephoto: {
            type: String,
            default:""
            
            }
        






    },
    { timestamps: true }
);

export const Employee = mongoose.model("Employee", employeeSchema);
