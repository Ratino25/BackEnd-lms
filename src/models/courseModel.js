import mongoose from "mongoose";

const courseModel = mongoose.Schema({
    name: {type: String, required: true},
    thumbnail: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    },
    tagline: {type: String, required: true},
    desctiption: {type: String, required: true},
    students: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    details: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseDetail'
        }
    ]
})

export default mongoose.model('Course', courseModel)