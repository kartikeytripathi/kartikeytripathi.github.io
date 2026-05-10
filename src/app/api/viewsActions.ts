"use server";

import { connectToDatabase } from "@/lib/database";
import View from "@/model/views.model";

export async function getViewsServerAction() {
  await connectToDatabase();
  const doc = await View.findOne();
  return { views: doc?.views ?? 0 };
}

export async function setViewsServerAction() {
  await connectToDatabase();
  await View.findOneAndUpdate(
    {},
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );
  return { success: true };
}

export async function addViewsServerAction() {
  return setViewsServerAction();
}
