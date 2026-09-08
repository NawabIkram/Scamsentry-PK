const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Attempt standard MongoDB URI connection (2-second timeout check)
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`Local MongoDB service unavailable (${error.message}). Launching in-memory MongoDB fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Server Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`Database Connection Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
