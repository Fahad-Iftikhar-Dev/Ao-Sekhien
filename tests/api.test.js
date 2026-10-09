import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import { connectDb } from '../src/config/db.js';
import Admin from '../src/models/Admin.js';

let mongo;
let token;

beforeAll(async () => {
  process.env.JWT_SECRET = 'test-secret';
  mongo = await MongoMemoryServer.create();
  await connectDb(mongo.getUri());
  await Admin.create({ email: 'admin@test.com', passwordHash: await Admin.hashPassword('password123') });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongo.stop();
});

test('admin login returns a JWT', async () => {
  const res = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'password123' });
  expect(res.status).toBe(200);
  expect(res.body.data.token).toBeTruthy();
  token = res.body.data.token;
});

test('unauthorized admin request is blocked', async () => {
  const res = await request(app).post('/api/categories').send({ name: 'Duas' });
  expect(res.status).toBe(401);
});

test('authenticated admin can change password securely', async () => {
  const wrong = await request(app)
    .put('/api/auth/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'wrong-password', newPassword: 'newPassword123', confirmPassword: 'newPassword123' });
  expect(wrong.status).toBe(400);

  const mismatch = await request(app)
    .put('/api/auth/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'password123', newPassword: 'newPassword123', confirmPassword: 'differentPassword123' });
  expect(mismatch.status).toBe(422);

  const changed = await request(app)
    .put('/api/auth/change-password')
    .set('Authorization', `Bearer ${token}`)
    .send({ currentPassword: 'password123', newPassword: 'newPassword123', confirmPassword: 'newPassword123' });
  expect(changed.status).toBe(200);
  expect(changed.body.message).toBe('Password changed successfully');

  const relogin = await request(app).post('/api/auth/login').send({ email: 'admin@test.com', password: 'newPassword123' });
  expect(relogin.status).toBe(200);
});

test('authenticated admin creates category, subcategory, content, announcement', async () => {
  const arabicText = 'اللَّهُمَّ إِنَّا نَسْأَلُكَ فِي سَفَرِنَا هَذَا الْبِرَّ وَالتَّقْوَى';
  const category = await request(app).post('/api/categories').set('Authorization', `Bearer ${token}`).send({ name: 'Duas', nameUrdu: 'دعائیں', sortOrder: 1 });
  expect(category.status).toBe(201);

  const categories = await request(app).get('/api/categories');
  expect(categories.body.data).toHaveLength(1);

  const subcategory = await request(app).post('/api/subcategories').set('Authorization', `Bearer ${token}`).send({
    categoryId: category.body.data._id,
    name: 'Travel',
    nameUrdu: 'سفر',
    sortOrder: 1
  });
  expect(subcategory.status).toBe(201);

  const content = await request(app).post('/api/content').set('Authorization', `Bearer ${token}`).send({
    categoryId: category.body.data._id,
    subcategoryId: subcategory.body.data._id,
    title: 'Travel Dua',
    arabicText,
    urduTranslation: 'اردو ترجمہ',
    englishTranslation: 'English translation',
    sortOrder: 1
  });
  expect(content.status).toBe(201);

  const publicContent = await request(app).get(`/api/subcategories/${subcategory.body.data._id}/content`);
  expect(publicContent.body.data[0].title).toBe('Travel Dua');
  expect(publicContent.body.data[0].arabicText).toBe(arabicText);

  const detail = await request(app).get(`/api/content/${content.body.data._id}`);
  expect(detail.body.data.arabicText).toBe(arabicText);

  const announcement = await request(app).post('/api/announcements').set('Authorization', `Bearer ${token}`).send({
    title: 'New Duas Added',
    message: 'We have added new duas.',
    startAt: new Date(Date.now() - 1000).toISOString(),
    endAt: new Date(Date.now() + 86400000).toISOString(),
    isActive: true
  });
  expect(announcement.status).toBe(201);

  const active = await request(app).get('/api/announcements/active');
  expect(active.body.data).toHaveLength(1);
});
