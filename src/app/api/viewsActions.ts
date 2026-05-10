// src/app/api/viewsActions.ts
"use server";

export async function getViewsServerAction() {
  return { views: 0 };
}

export async function setViewsServerAction() {
  return { success: true };
}

export async function addViewsServerAction() {
  return { success: true };
}
