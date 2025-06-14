import courseModel from "../models/courseModel.js";
import fs from 'fs'
import { mutateCourseSchema } from "../utils/schema.js";
import categoryModel from "../models/categoryModel.js";
import userModel from "../models/userModel.js";
import path from "path";




export const getCourse = async (req, res) => {
    try {
        const courses = await courseModel.find({
            manager: req.user?._id
        })
            .select('name thumbnail')
            .populate({
                path: 'category',
                select: 'name -_id'
            })
            .populate({
                path: 'students',
                select: 'name'
            })

        const imageUrl = process.env.APP_URL + '/uploads/courses/'

        const response = courses.map((item) => {
            return {
                ...item.toObject(),
                thumbnail_url: imageUrl + item.thumbnail,
                total_students : item.students.length
            }
        })

        return res.json({
            message: 'Get Courses Success',
            data: response
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

export const getCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find()

        return res.json({
            message: "Get Category Success",
            data: categories
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const postCourse = async (req, res) => {
    try {
        const body = req.body
        // console.log(body)

        console.log(req.file)

        const parse = mutateCourseSchema.safeParse(body)

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

        const category = await categoryModel.findById(parse.data.categoryId)
        console.log(category)


        if (!category) {
            return res.status(500).json({
                message: 'Category Id not found'
            })
        }

        const course = new courseModel({
            name: parse.data.name,
            category: category._id,
            description: parse.data.description,
            tagline: parse.data.tagline,
            thumbnail: req.file?.filename,
            manager: req.user._id
        })

        await course.save()

        await categoryModel.findByIdAndUpdate(category._id, {
            $push: {
                // course: course._id
                courses: course._id
            },
            
        }, {new: true})

        await userModel.findByIdAndUpdate(req.user?._id, {
            $push: {
                courses: course._id
            }
        }, {new: true})

        return res.json({message: 'Create Course Success'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const updateCourse = async (req, res) => {
    try {
        const body = req.body
        const courseId = req.params.id

        const parse = mutateCourseSchema.safeParse(body)

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

        const category = await categoryModel.findById(parse.data.categoryId)
        const oldCourse = await courseModel.findById(courseId)


        if (!category) {
            return res.status(500).json({
                message: 'Category Id not found'
            })
        }

        await courseModel.findByIdAndUpdate(
            courseId,
            {
                name: parse.data.name,
                category: category._id,
                description: parse.data.description,
                tagline: parse.data.tagline,
                thumbnail: req?.file ? req.file?.filename : oldCourse.thumbnail,
                manager: req.user._id
            }
        )

        return res.json({message: 'Update Course Success'})

    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

export const deleteCourse = async (req, res) => {
    try {
        const {id} = req.params
        console.log(id)

        const course = await courseModel.findById(id)

        const dirName = path.resolve()

        const filePath = path.join(dirName, "public/uploads/courses", course.thumbnail)

        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath)
        }

        await courseModel.findByIdAndDelete(id)

        return res.json({
            message: 'Delete Course Success'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: "Internal Server Error"
        })
        
    }
}