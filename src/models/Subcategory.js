import mongoose from 'mongoose';

const subcategorySchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    nameUrdu: { type: String, trim: true },
    nameEnglish: { type: String, trim: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

subcategorySchema.index({ categoryId: 1, isActive: 1, sortOrder: 1 });

export default mongoose.model('Subcategory', subcategorySchema);

