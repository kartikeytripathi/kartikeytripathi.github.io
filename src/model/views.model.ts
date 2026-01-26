import mongoose from "mongoose";

const ViewSchema = new mongoose.Schema({
  views: { type: Number, default: 0 },
});

export default mongoose.models.View || mongoose.model("View", ViewSchema);
