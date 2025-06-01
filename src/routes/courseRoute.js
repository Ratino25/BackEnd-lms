import express from 'express'
import { getCourse, postCourse, updateCourse } from '../controllers/courseController.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'
import multer from 'multer'

const courseRoute = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoute.get('/courses', verifyToken,  getCourse)
courseRoute.post('/courses', verifyToken, upload.single('thumbnail'), postCourse)
courseRoute.put('/courses/:id', verifyToken, upload.single('thumbnail'), updateCourse)


export default courseRoute