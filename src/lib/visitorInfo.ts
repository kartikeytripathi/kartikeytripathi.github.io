import { headers } from "next/headers";
import { createHash } from "crypto";

export type VisitorInfo = {
  location: string;
  flag: string;
  timezone: string;
  localTime: string;
  device: string;
  referrer: string;
  ipHash: string;
  isBot: boolean;
};

/** Turn a 2-letter ISO country code into its flag emoji. */
function countryFlag(code?: string) {
  if (!code || code.length !== 2) return "🌐";
  const A = 0x1f1e6;
  return String.fromCodePoint(
    ...[...code.toUpperCase()].map((c) => A + c.charCodeAt(0) - 65)
  );
}

/** Best-effort device string from the User-Agent, e.g. "iPhone · Safari". */
function parseDevice(ua: string) {
  const os =
    /iPhone|iPad|iPod/.test(ua)
      ? "iOS"
      : /Android/.test(ua)
      ? "Android"
      : /Windows/.test(ua)
      ? "Windows"
      : /Mac OS X/.test(ua)
      ? "macOS"
      : /Linux/.test(ua)
      ? "Linux"
      : "Unknown OS";

  const browser =
    /Edg\//.test(ua)
      ? "Edge"
      : /OPR\/|Opera/.test(ua)
      ? "Opera"
      : /Chrome\//.test(ua) && !/Chromium/.test(ua)
      ? "Chrome"
      : /Firefox\//.test(ua)
      ? "Firefox"
      : /Safari\//.test(ua)
      ? "Safari"
      : "Unknown browser";

  const kind = /Mobi|Android|iPhone|iPad|iPod/.test(ua) ? "📱" : "💻";
  return `${kind} ${os} · ${browser}`;
}

function looksLikeBot(ua: string) {
  return /bot|crawl|spider|preview|facebookexternalhit|WhatsApp|Slackbot|LinkedInBot|Twitterbot|TelegramBot|Discordbot|bingbot|Googlebot|embedly|redditbot/i.test(
    ua
  );
}

export async function collectVisitorInfo(): Promise<VisitorInfo> {
  const h = await headers();

  const ua = h.get("user-agent") ?? "";
  const rawIp =
    h.get("x-forwarded-for")?.split(",")[0].trim() ||
    h.get("x-real-ip") ||
    "";

  const city = h.get("x-vercel-ip-city");
  const region = h.get("x-vercel-ip-country-region");
  const country = h.get("x-vercel-ip-country") ?? undefined;
  const timezone = h.get("x-vercel-ip-timezone") ?? "";

  const locationParts = [
    city ? decodeURIComponent(city) : null,
    region,
    country,
  ].filter(Boolean);
  const location = locationParts.length ? locationParts.join(", ") : "Unknown";

  let localTime = "—";
  if (timezone) {
    try {
      localTime = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).format(new Date());
    } catch {
      // invalid timezone header — leave as em dash
    }
  }

  const referer = h.get("referer");
  let referrer = "Direct / unknown";
  if (referer) {
    try {
      referrer = new URL(referer).hostname;
    } catch {
      referrer = referer;
    }
  }

  const ipHash = rawIp
    ? createHash("sha256")
        .update(rawIp + (process.env.IP_HASH_SALT ?? ""))
        .digest("hex")
        .slice(0, 12)
    : "unknown";

  return {
    location,
    flag: countryFlag(country),
    timezone: timezone || "—",
    localTime,
    device: ua ? parseDevice(ua) : "Unknown",
    referrer,
    ipHash,
    isBot: looksLikeBot(ua),
  };
}

export function fallbackVisitorInfo(): VisitorInfo {
  return {
    location: "Unknown",
    flag: "🌐",
    timezone: "—",
    localTime: "—",
    device: "Unknown",
    referrer: "Direct / unknown",
    ipHash: "unknown",
    isBot: false,
  };
}

/** Shared visitor-details card used across visit/like/comment notification emails. */
export function buildVisitorEmailHtml(opts: {
  emoji: string;
  eventLabel: string;
  headline: string;
  info: VisitorInfo;
  bodyHtml?: string;
  footerLabel?: string;
  footerValue?: string;
}) {
  const { emoji, eventLabel, headline, info, bodyHtml, footerLabel, footerValue } = opts;

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500;">${value}</td>
    </tr>`;

  return `
  <div style="background:#f3f4f6;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:20px 24px;color:#ffffff;">
        <div style="font-size:15px;opacity:0.85;">${emoji} ${eventLabel}</div>
        <div style="font-size:18px;font-weight:700;margin-top:4px;line-height:1.4;">${headline}</div>
      </div>
      ${bodyHtml ?? ""}
      <div style="padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("📍 Location", `${info.flag} ${info.location}`)}
          ${row("🕐 Their time", `${info.localTime} <span style="color:#9ca3af;">(${info.timezone})</span>`)}
          ${row("💻 Device", info.device)}
          ${row("🔗 Came from", info.referrer)}
          ${row("🌐 IP hash", `<code style="font-size:12px;color:#6b7280;">${info.ipHash}</code>`)}
          ${row("🤖 Likely bot", info.isBot ? "⚠️ Yes" : "No")}
        </table>
      </div>
      ${
        footerLabel
          ? `<div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #eef0f3;color:#374151;font-size:14px;">
        ${footerLabel}: <strong>${footerValue}</strong>
      </div>`
          : ""
      }
    </div>
  </div>`;
}
