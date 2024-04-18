import mongoose from "mongoose";
import config from "../config";

const connectDB = async () => {
  try {
    if (config.databaseUrl) {
      await mongoose.connect(config.databaseUrl);
    }
    console.log("Connected to Database");
  } catch (error) {
    console.log(`Cannot connect to Database: ${error}`);
  }
};

export default connectDB;
