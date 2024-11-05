import express from 'express';
import { protect } from '../middleware/auth.js';
import { updateProfile, deleteAccount } from '../controllers/user.js';

const router = express.Router();

router.use(protect); // All user routes require authentication

router.patch('/profile', updateProfile);
router.delete('/account', deleteAccount);

export default router;