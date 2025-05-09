import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initMongoConnection = async () => {
  try {console.log('MONGODB_URL:', process.env.MONGODB_URL);
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: process.env.MONGODB_DB,
      user: process.env.MONGODB_USER,
      pass: process.env.MONGODB_PASSWORD,
    });
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Mongo connection error:', error.message);
    process.exit(1);
  }
};
