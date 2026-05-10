"use server";

import { connectToDatabase } from "@/lib/database";
import LoveCount from "@/model/loveCount.model";

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
  return { success: true, count: doc.count };
}

export async function setLoveCountServerAction(count: number) {
  await connectToDatabase();
  const doc = await LoveCount.findOneAndUpdate(
    {},
    { $set: { count } },
    { upsert: true, new: true }
  );
  return { success: true, count: doc.count };
}
