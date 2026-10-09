import { Router } from 'express';
import { createCategory, deleteCategory, getCategory, listCategories, updateCategory } from '../controllers/categoryController.js';
import { listByCategory } from '../controllers/subcategoryController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { categorySchema } from '../validators.js';

const router = Router();
router.get('/', optionalAuth, listCategories);
router.get('/:id', optionalAuth, getCategory);
router.get('/:categoryId/subcategories', optionalAuth, listByCategory);
router.post('/', requireAuth, validate(categorySchema), createCategory);
router.put('/:id', requireAuth, validate(categorySchema), updateCategory);
router.delete('/:id', requireAuth, deleteCategory);
export default router;
