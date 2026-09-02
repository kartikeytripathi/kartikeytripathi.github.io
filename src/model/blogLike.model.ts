import mongoose from "mongoose";

const BlogLikeSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  count: { type: Number, default: 0 },
});

export default mongoose.models.BlogLike ||
  mongoose.model("BlogLike", BlogLikeSchema);
