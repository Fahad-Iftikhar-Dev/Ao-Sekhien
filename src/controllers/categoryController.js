import Category from '../models/Category.js';
import Subcategory from '../models/Subcategory.js';
import Content from '../models/Content.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const listCategories = asyncHandler(async (req, res) => {
  const filter = req.admin ? {} : { isActive: true };
  const categories = await Category.find(filter).sort({ sortOrder: 1, createdAt: 1 });
  return ok(res, categories);
});

export const getCategory = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id, ...(req.admin ? {} : { isActive: true }) };
  const category = await Category.findOne(filter);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  return ok(res, category);
});

export const createCategory = asyncHandler(async (req, res) => ok(res, await Category.create(req.body), 201));

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  return ok(res, category);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  await Content.deleteMany({ categoryId: req.params.id });
  await Subcategory.deleteMany({ categoryId: req.params.id });
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ success: false, message: 'Category not found' });
  return ok(res, { deleted: true });
});

