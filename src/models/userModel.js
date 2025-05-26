import mongoose from "mongoose";

const userModel  = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    photo: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    role: {
        type: String,
        enum: ['manager', 'student'],
        default: 'manager'
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        }
    ],
    manager: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
})

export default mongoose.model("User", userModel )