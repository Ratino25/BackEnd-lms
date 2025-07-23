import userModel from "../models/userModel.js"
import bcrypt from "bcrypt"
import { mutateStudentSchema } from "../utils/schema.js"

export const getStudents = async (req, res) => {
    try {
        const students = await userModel.find({
            role: 'student',
            manager: req.user_id
        })

        return res.json({
            message: "Get students successfully",
            data: students
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