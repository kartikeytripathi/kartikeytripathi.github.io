"use server";

import { connectToDatabase } from "@/lib/database";
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
  const doc = await LoveCount.findOneAndUpdate(
    {},
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: "❤️ Someone loved your portfolio",
    text: `Your portfolio just received a love! Total loves: ${doc.count}`,
  });

  return { success: true, count: doc.count };
}

