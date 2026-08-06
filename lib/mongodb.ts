import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://upvc-project:BG7A9c3etl8TNWnc@ac-pwdes3o-shard-00-00.7ixtc5d.mongodb.net:27017,ac-pwdes3o-shard-00-01.7ixtc5d.mongodb.net:27017,ac-pwdes3o-shard-00-02.7ixtc5d.mongodb.net:27017/upvc_database?ssl=true&replicaSet=atlas-kopc9x-shard-0&authSource=admin&appName=upvc-project';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log('Successfully connected to MongoDB');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
