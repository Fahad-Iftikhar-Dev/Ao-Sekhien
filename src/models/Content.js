import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema(
  {
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    subcategoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subcategory', required: true, index: true },
    title: { type: String, required: true, trim: true },
    titleUrdu: { type: String, trim: true },
    titleEnglish: { type: String, trim: true },
    arabicText: { type: String, required: true, trim: true },
    urduTranslation: { type: String, required: true, trim: true },
    englishTranslation: { type: String, required: true, trim: true },
    reference: { type: String, trim: true },
    notes: { type: String },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

contentSchema.index({ subcategoryId: 1, isActive: 1, sortOrder: 1 });
contentSchema.index({
  title: 'text',
  titleUrdu: 'text',
  titleEnglish: 'text',
  arabicText: 'text',
  urduTranslation: 'text',
  englishTranslation: 'text',
  reference: 'text'
});

export default mongoose.model('Content', contentSchema);
