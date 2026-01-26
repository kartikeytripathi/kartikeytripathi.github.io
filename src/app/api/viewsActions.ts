"use server";

import connectToDatabase from "@/lib/database";
import View from "@/model/views.model";

export async function getViewsServerAction() {
  try {
    await connectToDatabase();
    const viewDoc = await View.findOne({});
    return { success: true, views: viewDoc?.views ?? 0 };
  } catch {
    return { success: false, message: "Failed to get views" };
  }
}

export async function setViewsServerAction() {
  try {
    await connectToDatabase();
    await View.findOneAndUpdate({}, { $inc: { views: 1 } }, { new: true, upsert: true });
    return { success: true, message: "View added successfully" };
  } catch {
    return { success: false, message: "Failed to set views" };
  }
}
