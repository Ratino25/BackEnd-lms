import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import { mutateStudentSchema } from "../utils/schema.js"
import courseModel from "../models/courseModel.js"
import path from "path"
import fs from "fs"

export const getStudents = async (req, res) => {
    try {
        const students = await userModel.find({
            role: 'student',
            manager: req.user._id
        }).select('name courses photo')

        const photoUrl = process.env.APP_URL + '/uploads/students/';

        const response = students.map((item) => {
            return {
                ...item.toObject(),
                photo_url: photoUrl + item.photo
            }
        })

        return res.json({
            message: "Get students successfully",
            data: response,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const postStudent = async (req, res) => {
    try {
        const body = req.body
        // console.log(body)

        console.log(req.file)

        const parse = mutateStudentSchema.safeParse(body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => err.message)

            if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path)
            }
            return res.status(500).json({
                message: 'Error Validation',
                data: null,
                errors: errorMessage
            })
        }

        const hashPassword = bcrypt.hashSync(body.password, 12);

        const student = new userModel({
            name: parse.data.name,
            email: parse.data.email,
            password: hashPassword,
            photo: req.file?.filename,
            manager: req.user?._id,
            role: 'student'
        })

        await student.save()

        return res.json({
            message: "Create student successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const updateStudent = async (req, res) => {
    try {
        const { id } = req.params
        const body = req.body
        // console.log(body)

        console.log(req.file)

        const parse = mutateStudentSchema.partial({
            password: true,
        }).safeParse(body)

        if (!parse.success) {
            const errorMessage = parse.error.issues.map((err) => err.message)

            if (req?.file?.path && fs.existsSync(req?.file?.path)) {
                fs.unlinkSync(req?.file?.path)
            }
            return res.status(500).json({
                message: 'Error Validation',
                data: null,
                errors: errorMessage
            })
        }

        const student = await userModel.findById(id)

        const hashPassword = parse.data?.password ? bcrypt.hashSync(body.password, 12) : student.password;

        await userModel.findByIdAndUpdate(id, {
            name: parse.data.name,
            email: parse.data.email,
            password: hashPassword,
            photo: req?.file ? req.file?.filename : student.photo
        })



        await student.save()

        return res.json({
            message: "Update student successfully",
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
    }
}

export const deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;

        const student = await userModel.findById(id);

        await courseModel.findOneAndUpdate({
            students: id
        }, {
            $pull: {
                students: id
            }
        })

        const dirName = path.resolve()

        const filePath = path.join(dirName, "public/uploads/students", student.photo)

        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath)
        }

        await userModel.findByIdAndDelete(id)
        return res.json({
            message: "Delete student successfully"
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        });

    }
}