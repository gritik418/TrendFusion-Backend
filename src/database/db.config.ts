import { connect } from "mongoose";

const MONGO_URI: string = process.env.MONGO_URI!;

const connectDB = async () => {
  try {
    const { connection } = await connect(MONGO_URI);
    console.log(`Mongo connected: ${connection.name}`);
  } catch (error) {
    console.log(`Mongo Error: ${error}`);
  }
};

export default connectDB;
