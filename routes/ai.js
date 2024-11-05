import express from 'express';
import { protect } from '../middleware/auth.js';
import { chat } from '../controllers/ai.js';

const router = express.Router();

router.use(protect);
router.post('/chat', chat);

export default router;