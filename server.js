import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDb } from './src/config/db.js';

dotenv.config();

const port = process.env.PORT || 5000;

connectDb().then(() => {
  app.listen(port, () => {
    console.log(`API listening on port ${port}`);
  });
});

