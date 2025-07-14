import express from 'express';
import { verifyToken } from '../middlewares/verifyToken.js';
import { getStudents } from '../controllers/studentController.js';


const studentRoutes = express.Router();

studentRoutes.get('/students', verifyToken, getStudents)

export default studentRoutes;