import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    message: { type: String, required: true },
    startAt: { type: Date, required: true },
    endAt: { type: Date, required: true },
    isActive: { type: Boolean, default: true, index: true }
  },
  { timestamps: true }
);

announcementSchema.index({ isActive: 1, startAt: 1, endAt: 1 });

export default mongoose.model('Announcement', announcementSchema);

