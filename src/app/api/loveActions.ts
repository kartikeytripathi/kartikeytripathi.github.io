// src/app/api/loveActions.ts
"use server";

export async function getLoveCountServerAction() {
  return 0;
}

export async function setLoveCountServerAction(_count: number) {
  // MongoDB disabled – do nothing
  return { success: true };
}

export async function addLoveServerAction() {
  return { success: true };
}
