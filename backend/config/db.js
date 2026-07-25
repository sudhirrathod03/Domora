import mongoose from "mongoose";
import 'dotenv/config';

const mongo_url = process.env.MONGO_URI;
console.log(mongo_url);
const connectDB = async () => {
  try {

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error(" Database Connection Failed:", error.message);
    process.exit(1); // exit if DB connection fails
  }
};

export default connectDB;