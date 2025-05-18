import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

const dbUrl = process.env.DATABASE_URL;

export const connectDb = async () => {
  try {
    const response = await mongoose.connect(dbUrl);
    console.log(`Database is connected to: ${response.connection.host}`);
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDb, 5000);
  }
};
