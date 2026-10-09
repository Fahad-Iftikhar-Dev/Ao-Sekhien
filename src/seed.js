import './config/loadEnv.js';
import { connectDb } from './config/db.js';
import Admin from './models/Admin.js';
import Category from './models/Category.js';
import Subcategory from './models/Subcategory.js';
import Content from './models/Content.js';
import Announcement from './models/Announcement.js';

await connectDb();

const email = process.env.ADMIN_EMAIL;
const password = process.env.ADMIN_PASSWORD;

if (!email || !password || password === 'change-this-password') {
  throw new Error('Set ADMIN_EMAIL and a secure ADMIN_PASSWORD before running seed');
}

let admin = await Admin.findOne({ email });
if (!admin) {
  admin = await Admin.create({ email, passwordHash: await Admin.hashPassword(password) });
}

const category = await Category.findOneAndUpdate(
  { nameEnglish: 'Duas' },
  { name: 'Duas', nameUrdu: 'دعائیں', nameEnglish: 'Duas', icon: 'book-open', sortOrder: 1, isActive: true },
  { upsert: true, new: true }
);

const subcategory = await Subcategory.findOneAndUpdate(
  { categoryId: category._id, nameEnglish: 'Travel' },
  { categoryId: category._id, name: 'Travel', nameUrdu: 'سفر', nameEnglish: 'Travel', sortOrder: 1, isActive: true },
  { upsert: true, new: true }
);

await Content.findOneAndUpdate(
  { subcategoryId: subcategory._id, titleEnglish: 'Travel Dua' },
  {
    categoryId: category._id,
    subcategoryId: subcategory._id,
    title: 'Travel Dua',
    titleUrdu: 'سفر کی دعا',
    titleEnglish: 'Travel Dua',
    arabicText: 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى',
    urduTranslation: 'اے اللہ! ہم اپنے اس سفر میں تجھ سے نیکی اور تقویٰ کا سوال کرتے ہیں۔',
    englishTranslation: 'O Allah, we ask You for righteousness and piety in this journey.',
    reference: 'Hisn al-Muslim',
    sortOrder: 1,
    isActive: true
  },
  { upsert: true, new: true }
);

await Announcement.findOneAndUpdate({
  title: 'New Islamic Content Added'
}, {
  title: 'New Islamic Content Added',
  message: 'New duas have been added to the application.',
  startAt: new Date(),
  endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  isActive: true
}, { upsert: true, new: true });

console.log(`Seed complete. Admin: ${admin.email}`);
process.exit(0);
