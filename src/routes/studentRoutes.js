import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getStudents, postStudent, updateStudent } from '../controllers/studentController.js';
import { fileFilter, fileStorage } from '../utils/multer.js';


const studentRoutes = express.Router();

const upload = multer({
    storage: fileStorage('students'),
    fileFilter
})

studentRoutes.get('/students', verifyToken, getStudents)
studentRoutes.post('/students', verifyToken, upload.single('avatar'), postStudent)
studentRoutes.put('/students/:id', verifyToken, upload.single('avatar'), updateStudent)

export default studentRoutes;