import express from 'express'
import { getCourse } from '../controllers/courseController.js'
import { verifyToken } from '../middlewares/verifyToken.js'

const courseRoute = express.Router()

courseRoute.get('/courses', verifyToken,  getCourse)

export default courseRoute