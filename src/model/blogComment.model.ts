import mongoose from "mongoose";

const BlogCommentSchema = new mongoose.Schema({
  slug: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.BlogComment ||
  mongoose.model("BlogComment", BlogCommentSchema);
