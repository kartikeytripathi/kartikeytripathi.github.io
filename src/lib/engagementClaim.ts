import EngagementClaim from "@/model/engagementClaim.model";

/**
 * Atomically claim a one-time action for this visitor. Returns false if the
 * key was already claimed. Visitors with no resolvable IP (local dev) are
 * always allowed — on Vercel the client IP header is always set.
 * Callers must have connected to the database first.
 */
export async function claimOnce(key: string, ipHash: string, ttlMs?: number) {
  if (ipHash === "unknown") return true;
  try {
    await EngagementClaim.create({
      key,
      expiresAt: ttlMs ? new Date(Date.now() + ttlMs) : undefined,
    });
    return true;
  } catch (err) {
    if ((err as { code?: number }).code === 11000) return false;
    throw err;
  }
}
