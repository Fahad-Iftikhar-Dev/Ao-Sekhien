import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    nameUrdu: { type: String, trim: true },
    nameEnglish: { type: String, trim: true },
    icon: { type: String, trim: true },
    description: { type: String, trim: true },
    sortOrder: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

categorySchema.index({ isActive: 1, sortOrder: 1 });

export default mongoose.model('Category', categorySchema);

