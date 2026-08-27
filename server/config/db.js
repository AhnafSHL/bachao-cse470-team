import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let memoryServer = null;

/**
 * Connect to MongoDB.
 * - If MONGODB_URI is set (e.g. Atlas or a local install), use it.
 * - Otherwise spin up a self-contained MongoDB via mongodb-memory-server,
 *   storing data on disk so it persists across restarts. This lets the
 *   whole project run with zero database setup.
 */
export const connectDB = async () => {
  let uri = process.env.MONGODB_URI && process.env.MONGODB_URI.trim();

  if (!uri) {
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    const dbPath = path.join(__dirname, '..', '.mongo-data');
    fs.mkdirSync(dbPath, { recursive: true });

    memoryServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'bachao',
        dbPath,
        storageEngine: 'wiredTiger',
      },
    });
    uri = memoryServer.getUri('bachao');
    console.log('🌱 No MONGODB_URI set — started self-contained MongoDB (data persists in server/.mongo-data)');
  }

  mongoose.set('strictQuery', true);
  const conn = await mongoose.connect(uri);
  console.log(`✅ MongoDB connected: ${conn.connection.host}/${conn.connection.name}`);
  return conn;
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) await memoryServer.stop({ doCleanup: false, force: false });
};
