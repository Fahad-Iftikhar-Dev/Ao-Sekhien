import Announcement from '../models/Announcement.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const activeAnnouncements = asyncHandler(async (req, res) => {
  const now = new Date();
  const announcements = await Announcement.find({
    isActive: true,
    startAt: { $lte: now },
    endAt: { $gte: now }
  }).sort({ startAt: -1 });
  return ok(res, announcements);
});

export const listAnnouncements = asyncHandler(async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  return ok(res, announcements);
});

export const createAnnouncement = asyncHandler(async (req, res) => ok(res, await Announcement.create(req.body), 201));

export const updateAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
  return ok(res, announcement);
});

export const deleteAnnouncement = asyncHandler(async (req, res) => {
  const announcement = await Announcement.findByIdAndDelete(req.params.id);
  if (!announcement) return res.status(404).json({ success: false, message: 'Announcement not found' });
  return ok(res, { deleted: true });
});

