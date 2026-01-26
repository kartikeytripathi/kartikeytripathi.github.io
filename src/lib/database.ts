import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("❌ Please define MONGODB_URI in environment variables");
}

// Prevent multiple connections in Vercel's serverless environment
let isConnected = false;

export default async function connectToDatabase() {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      dbName: "PortfolioX", // ✅ explicitly name your DB
      bufferCommands: false, // recommended for serverless
    });

    isConnected = !!db.connections[0].readyState;
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    throw new Error("MongoDB connection failed");
  }
}
