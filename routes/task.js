import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTaskComplete
} from '../controllers/task.js';

const router = express.Router();

router.use(protect); // All task routes require authentication

router.route('/')
  .get(getTasks)
  .post(createTask);

router.route('/:id')
  .patch(updateTask)
  .delete(deleteTask);

router.patch('/:id/toggle', toggleTaskComplete);

export default router;