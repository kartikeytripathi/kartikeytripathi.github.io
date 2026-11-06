import mongoose from "mongoose";

const BlogCommentSchema = new mongoose.Schema({
  slug: { type: String, required: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 60 },
  message: { type: String, required: true, trim: true, maxlength: 1000 },
  // Salted visitor hash, used only for per-visitor rate limiting — never returned to clients.
  ipHash: { type: String },
  createdAt: { type: Date, default: Date.now },
});

BlogCommentSchema.index({ ipHash: 1, createdAt: -1 });

export default mongoose.models.BlogComment ||
  mongoose.model("BlogComment", BlogCommentSchema);
