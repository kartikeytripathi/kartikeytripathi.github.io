import mongoose from "mongoose";

const LoveCountSchema = new mongoose.Schema({
  count: { type: Number, default: 0 },
});

export default mongoose.models.LoveCount || mongoose.model("LoveCount", LoveCountSchema);
