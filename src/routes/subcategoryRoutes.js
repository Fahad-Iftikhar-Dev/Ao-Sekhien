import { Router } from 'express';
import { createSubcategory, deleteSubcategory, getSubcategory, listSubcategories, updateSubcategory } from '../controllers/subcategoryController.js';
import { listBySubcategory } from '../controllers/contentController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { subcategorySchema } from '../validators.js';

const router = Router();
router.get('/', requireAuth, listSubcategories);
router.get('/:id', optionalAuth, getSubcategory);
router.get('/:subcategoryId/content', optionalAuth, listBySubcategory);
router.post('/', requireAuth, validate(subcategorySchema), createSubcategory);
router.put('/:id', requireAuth, validate(subcategorySchema), updateSubcategory);
router.delete('/:id', requireAuth, deleteSubcategory);
export default router;
