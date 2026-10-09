import { Router } from 'express';
import { changePassword, login } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { changePasswordSchema, loginSchema } from '../validators.js';

const router = Router();
router.post('/login', validate(loginSchema), login);
router.put('/change-password', requireAuth, validate(changePasswordSchema), changePassword);
export default router;
