import express from 'express'
import { getCourse, postCourse } from '../controllers/courseController.js'
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
// courseRoute.post('/courses',
//   verifyToken,
//   upload.single('thumbnail'),
//   (req, res, next) => {
//     console.log('🟡 req.file:', req.file)
//     console.log('🟢 req.body:', req.body)
//     next()
//   },
//   postCourse
// )


export default courseRoute