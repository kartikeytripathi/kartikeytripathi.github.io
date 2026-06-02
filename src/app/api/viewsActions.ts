"use server";

import { connectToDatabase } from "@/lib/database";
import View from "@/model/views.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getViewsServerAction() {
  await connectToDatabase();
  const doc = await View.findOne();
  return { views: doc?.views ?? 0 };
}

export async function setViewsServerAction() {
  await connectToDatabase();
  const doc = await View.findOneAndUpdate(
    {},
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: "👀 Someone visited your portfolio",
    text: `Your portfolio just got a new visit! Total views: ${doc?.views ?? 1}`,
  });

  return { success: true };
}

export async function addViewsServerAction() {
  return setViewsServerAction();
}
