import { Router } from 'express';
import { activeAnnouncements, createAnnouncement, deleteAnnouncement, listAnnouncements, updateAnnouncement } from '../controllers/announcementController.js';
import { requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { announcementSchema } from '../validators.js';

const router = Router();
router.get('/active', activeAnnouncements);
router.get('/', requireAuth, listAnnouncements);
router.post('/', requireAuth, validate(announcementSchema), createAnnouncement);
router.put('/:id', requireAuth, validate(announcementSchema), updateAnnouncement);
router.delete('/:id', requireAuth, deleteAnnouncement);
export default router;

