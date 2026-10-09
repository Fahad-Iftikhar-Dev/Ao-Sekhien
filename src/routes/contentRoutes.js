import { Router } from 'express';
import { createContent, deleteContent, getContent, listContent, searchContent, updateContent } from '../controllers/contentController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { contentSchema } from '../validators.js';

const router = Router();
router.get('/search', searchContent);
router.get('/', requireAuth, listContent);
router.get('/:id', optionalAuth, getContent);
router.post('/', requireAuth, validate(contentSchema), createContent);
router.put('/:id', requireAuth, validate(contentSchema), updateContent);
router.delete('/:id', requireAuth, deleteContent);
export default router;
