import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  email: { type: String, default: "" },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Message ||
  mongoose.model("Message", MessageSchema);
