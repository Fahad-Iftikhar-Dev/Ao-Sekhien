import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Content from '../models/Content.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listByCategory = asyncHandler(async (req, res) => {
  const filter = { categoryId: req.params.categoryId, ...(req.admin ? {} : { isActive: true }) };
  const subcategories = await Subcategory.find(filter).populate('categoryId', 'name nameUrdu nameEnglish').sort({ sortOrder: 1, createdAt: 1 });
  return ok(res, subcategories);
});

export const listSubcategories = asyncHandler(async (req, res) => {
  const filter = req.query.categoryId ? { categoryId: req.query.categoryId } : {};
  const subcategories = await Subcategory.find(filter).populate('categoryId', 'name nameUrdu nameEnglish').sort({ sortOrder: 1, createdAt: 1 });
  return ok(res, subcategories);
});

export const getSubcategory = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...(req.admin ? {} : { isActive: true }) };
  const subcategory = await Subcategory.findOne(filter).populate('categoryId', 'name nameUrdu nameEnglish');
  if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
  return ok(res, subcategory);
});

export const createSubcategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.categoryId);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  return ok(res, await Subcategory.create(req.body), 201);
});

export const updateSubcategory = asyncHandler(async (req, res) => {
  const subcategory = await Subcategory.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
  return ok(res, subcategory);
});

export const deleteSubcategory = asyncHandler(async (req, res) => {
  await Content.deleteMany({ subcategoryId: req.params.id });
  const subcategory = await Subcategory.findByIdAndDelete(req.params.id);
  if (!subcategory) return res.status(404).json({ success: false, message: 'Subcategory not found' });
  return ok(res, { deleted: true });
});

