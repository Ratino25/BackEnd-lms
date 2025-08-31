import express from 'express'
import { deleteContentCourse, deleteCourse, getCategories, getCourse, getCourseById, getDetailContent, getStudentsByCourseId, postContentCourse, postCourse, postStudentToCourse, updateContentCourse, updateCourse } from '../controllers/courseController.js'
import { verifyToken } from '../middlewares/verifyToken.js'
import { fileFilter, fileStorageCourse } from '../utils/multer.js'
import multer from 'multer'
import { addStudentCourseSchema, mutateContentSchema } from '../utils/schema.js'
import { validateRequest } from '../middlewares/validateRequest.js'

const courseRoute = express.Router()

const upload = multer({
    storage: fileStorageCourse,
    fileFilter
})

courseRoute.get('/courses', verifyToken,  getCourse)
courseRoute.get('/categories', verifyToken, getCategories)
courseRoute.get('/courses/:id', verifyToken, getCourseById)
courseRoute.post('/courses', verifyToken, upload.single('thumbnail'), postCourse)
courseRoute.put('/courses/:id', verifyToken, upload.single('thumbnail'), updateCourse)
courseRoute.delete('/courses/:id', verifyToken, deleteCourse)

courseRoute.post('/courses/contents', verifyToken, validateRequest(mutateContentSchema), postContentCourse)
courseRoute.put('/courses/contents/:id', verifyToken, validateRequest(mutateContentSchema), updateContentCourse)

courseRoute.delete('/courses/contents/:id', verifyToken, deleteContentCourse)
courseRoute.get('/courses/contents/:id', verifyToken, getDetailContent)

courseRoute.get('/courses/students/:id', verifyToken, getStudentsByCourseId)
courseRoute.post('/courses/students/:id', verifyToken, validateRequest(addStudentCourseSchema), postStudentToCourse)


export default courseRoute