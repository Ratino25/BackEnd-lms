import userModel from "../models/userModel.js"

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