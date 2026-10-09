import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Content from '../models/Content.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { getPagination } from '../utils/pagination.js';

export const listBySubcategory = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = { subcategoryId: req.params.subcategoryId, ...(req.admin ? {} : { isActive: true }) };
  const [items, total] = await Promise.all([
    Content.find(filter).sort({ sortOrder: 1, createdAt: 1 }).skip(skip).limit(limit),
    Content.countDocuments(filter)
  ]);
  return ok(res, items, 200, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const listContent = asyncHandler(async (req, res) => {
  const { page, limit, skip } = getPagination(req.query);
  const filter = {
    ...(req.query.categoryId ? { categoryId: req.query.categoryId } : {}),
    ...(req.query.subcategoryId ? { subcategoryId: req.query.subcategoryId } : {})
  };
  const [items, total] = await Promise.all([
    Content.find(filter).populate('categoryId', 'name').populate('subcategoryId', 'name').sort({ sortOrder: 1 }).skip(skip).limit(limit),
    Content.countDocuments(filter)
  ]);
  return ok(res, items, 200, { page, limit, total, pages: Math.ceil(total / limit) });
});

export const searchContent = asyncHandler(async (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return ok(res, []);
  const rx = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
  const items = await Content.find({
    isActive: true,
    $or: [
      { title: rx }, { titleUrdu: rx }, { titleEnglish: rx }, { arabicText: rx },
      { urduTranslation: rx }, { englishTranslation: rx }, { reference: rx }
    ]
  }).sort({ sortOrder: 1 }).limit(50);
  return ok(res, items);
});

export const getContent = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...(req.admin ? {} : { isActive: true }) };
  const content = await Content.findOne(filter).populate('categoryId', 'name nameUrdu nameEnglish').populate('subcategoryId', 'name nameUrdu nameEnglish');
  if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
  return ok(res, content);
});

export const createContent = asyncHandler(async (req, res) => {
  const [category, subcategory] = await Promise.all([
    Category.findById(req.body.categoryId),
    Subcategory.findById(req.body.subcategoryId)
  ]);
  if (!category || !subcategory) return res.status(404).json({ success: false, message: 'Category or subcategory not found' });
  if (String(subcategory.categoryId) !== String(category._id)) {
    return res.status(422).json({ success: false, message: 'Subcategory does not belong to category' });
  }
  return ok(res, await Content.create(req.body), 201);
});

export const updateContent = asyncHandler(async (req, res) => {
  const content = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
  return ok(res, content);
});

export const deleteContent = asyncHandler(async (req, res) => {
  const content = await Content.findByIdAndDelete(req.params.id);
  if (!content) return res.status(404).json({ success: false, message: 'Content not found' });
  return ok(res, { deleted: true });
});

