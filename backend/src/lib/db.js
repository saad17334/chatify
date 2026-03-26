import mongoose from 'mongoose';
import {ENV} from "./env.js"

const connectDB = async () => {
  try {
    if(!ENV.MONGO_URI){
        throw new Error("MONGO URI is not set");
    }
    const conn = await mongoose.connect(ENV.MONGO_URI);
    console.log(`MongoDB connected successfully to ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
} 
export default connectDB;