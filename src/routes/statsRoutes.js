import { Router } from 'express';
import { stats } from '../controllers/statsController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.get('/', requireAuth, stats);
export default router;

