import '../src/config/loadEnv.js';
import app from '../src/app.js';
import { connectDb } from '../src/config/db.js';

let connectionPromise;

export default async function handler(req, res) {
  connectionPromise ||= connectDb();
  await connectionPromise;
  return app(req, res);
}

