import mongoose from "mongoose";

// One document per (action, post, visitor). The unique key makes "has this
// visitor already liked/viewed this post?" an atomic insert. Docs without
// expiresAt (likes) live forever; the TTL index reaps the rest (views).
const EngagementClaimSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  expiresAt: { type: Date },
});

EngagementClaimSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.EngagementClaim ||
  mongoose.model("EngagementClaim", EngagementClaimSchema);
