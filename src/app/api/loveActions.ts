// src/app/api/loveActions.ts
"use server";

export async function getLoveCountServerAction() {
  return { count: 0 };
}

export async function setLoveCountServerAction() {
  return { success: true, count: 0 };
}

export async function addLoveServerAction() {
  return { success: true };
}
