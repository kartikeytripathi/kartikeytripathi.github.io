// src/app/api/viewsActions.ts
"use server";

export async function getViewsServerAction() {
  return 0;
}

export async function setViewsServerAction(_count: number) {
  // MongoDB disabled – do nothing
  return { success: true };
}

export async function addViewsServerAction() {
  return { success: true };
}
