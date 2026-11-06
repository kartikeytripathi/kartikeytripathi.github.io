"use server";

import { connectToDatabase } from "@/lib/database";
import { claimOnce } from "@/lib/engagementClaim";
import { collectVisitorInfo, fallbackVisitorInfo } from "@/lib/visitorInfo";
import LoveCount from "@/model/loveCount.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getLoveCountServerAction() {
  await connectToDatabase();
  const doc = await LoveCount.findOne();
  return { count: doc?.count ?? 0 };
}

export async function addLoveServerAction() {
  await connectToDatabase();
  const info = await collectVisitorInfo().catch(() => fallbackVisitorInfo());

  // One love per visitor; repeats return the current count silently.
  if (!(await claimOnce(`site-love:${info.ipHash}`, info.ipHash))) {
    const existing = await LoveCount.findOne();
    return { success: true, count: existing?.count ?? 0 };
  }

  const doc = await LoveCount.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );

  if (!info.isBot) {
    await resend.emails.send({
      from: "portfolio@kartikeytripathi.in",
      to: "kartikey.tripathi.37@gmail.com",
      subject: "❤️ Someone loved your portfolio",
      text: `Your portfolio just received a love! Total loves: ${doc.count}`,
    });
  }

  return { success: true, count: doc.count };
}
