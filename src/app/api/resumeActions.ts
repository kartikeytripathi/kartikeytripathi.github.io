"use server";

import { connectToDatabase } from "@/lib/database";
import ResumeDownload from "@/model/resumeDownload.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function addResumeDownloadServerAction() {
  await connectToDatabase();
  const doc = await ResumeDownload.findOneAndUpdate(
    {},
    { $inc: { downloads: 1 } },
    { upsert: true, new: true }
  );

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: "📄 Someone downloaded your resume",
    text: `Your resume was just downloaded from the portfolio! Total downloads: ${doc.downloads}`,
  });

  return { success: true };
}
