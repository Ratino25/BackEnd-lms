import express from 'express'
import { deleteCourse, getCategories, getCourse, postCourse, updateCourse } from '../controllers/courseController.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'
import multer from 'multer'

const courseRoute = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoute.get('/courses', verifyToken,  getCourse)
courseRoute.get('/categories', verifyToken, getCategories)
courseRoute.post('/courses', verifyToken, upload.single('thumbnail'), postCourse)
courseRoute.put('/courses/:id', verifyToken, upload.single('thumbnail'), updateCourse)
courseRoute.delete('/courses/:id', verifyToken, deleteCourse)


export default courseRoute