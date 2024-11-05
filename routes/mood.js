import express from 'express';
import { protect } from '../middleware/auth.js';
import { 
  createMood,
  getMoods,
  updateMood,
  deleteMood
} from '../controllers/mood.js';

const router = express.Router();

router.use(protect); // All mood routes require authentication

router.route('/')
  .get(getMoods)
  .post(createMood);

router.route('/:id')
  .patch(updateMood)
  .delete(deleteMood);

export default router;