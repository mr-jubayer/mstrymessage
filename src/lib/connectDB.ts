import mongoose from "mongoose";

type connectionObject = {
  isConnected?: number;
};

const connection: connectionObject = {};

const connectDB: () => Promise<void> = async () => {
  if (connection.isConnected) {
    console.log("Database is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/mstry"
    );
    connection.isConnected = db.connections[0].readyState;

    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("Database connection failed", error);

    process.exit(1);
  }
};

export default connectDB;
