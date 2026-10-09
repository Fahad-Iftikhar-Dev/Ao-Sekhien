import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Content from '../models/Content.js';
import Announcement from '../models/Announcement.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const stats = asyncHandler(async (req, res) => {
  const now = new Date();
  const [categories, subcategories, content, namaz, duas, hadith, activeAnnouncements, recentContent] = await Promise.all([
    Category.countDocuments(),
    Subcategory.countDocuments(),
    Content.countDocuments(),
    Content.countDocuments({ $or: [{ title: /namaz/i }, { titleUrdu: /نماز/ }] }),
    Content.countDocuments({ $or: [{ title: /dua/i }, { titleUrdu: /دعا/ }, { titleUrdu: /دعائیں/ }] }),
    Content.countDocuments({ $or: [{ title: /hadith/i }, { titleUrdu: /حدیث/ }, { titleUrdu: /احادیث/ }] }),
    Announcement.countDocuments({ isActive: true, startAt: { $lte: now }, endAt: { $gte: now } }),
    Content.find().sort({ updatedAt: -1 }).limit(5).select('title updatedAt')
  ]);
  return ok(res, { categories, subcategories, content, namaz, duas, hadith, activeAnnouncements, recentContent });
});

