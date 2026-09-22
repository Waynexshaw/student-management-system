import { Router } from 'express';
import {
  createStudent,
  deleteStudent,
  getStudentById,
  getStudents,
  updateStudent
} from '../controllers/studentController.js';

const router = Router();

router.get('/', getStudents);
router.get('/:id', getStudentById);
router.post('/', createStudent);
router.patch('/:id', updateStudent);
router.delete('/:id', deleteStudent);

export default router;
