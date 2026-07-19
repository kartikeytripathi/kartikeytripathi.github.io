import mongoose from "mongoose";

const ResumeDownloadSchema = new mongoose.Schema({
  downloads: { type: Number, default: 0 },
});

export default mongoose.models.ResumeDownload ||
  mongoose.model("ResumeDownload", ResumeDownloadSchema);
