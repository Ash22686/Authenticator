import { Router } from 'express';
import { getUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Apply the 'protect' middleware to this route.
// The request will only reach 'getUserProfile' if the token is valid.
router.get('/profile', protect, getUserProfile);

export default router;