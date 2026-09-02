import mongoose from "mongoose";

const BlogViewSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true, index: true },
  views: { type: Number, default: 0 },
});

export default mongoose.models.BlogView ||
  mongoose.model("BlogView", BlogViewSchema);
