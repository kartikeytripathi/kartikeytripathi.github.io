"use server";

import { connectToDatabase } from "@/lib/database";
import View from "@/model/views.model";
import { Resend } from "resend";
import {
  collectVisitorInfo,
  fallbackVisitorInfo,
  type VisitorInfo,
} from "@/lib/visitorInfo";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function getViewsServerAction() {
  await connectToDatabase();
  const doc = await View.findOne();
  return { views: doc?.views ?? 0 };
}

function buildEmailHtml(info: VisitorInfo, totalViews: number) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:6px 0;color:#6b7280;font-size:13px;width:110px;vertical-align:top;">${label}</td>
      <td style="padding:6px 0;color:#111827;font-size:14px;font-weight:500;">${value}</td>
    </tr>`;

  return `
  <div style="background:#f3f4f6;padding:24px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="max-width:440px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:20px 24px;color:#ffffff;">
        <div style="font-size:15px;opacity:0.85;">👀 New portfolio visit</div>
        <div style="font-size:22px;font-weight:700;margin-top:4px;">${info.flag} ${info.location}</div>
      </div>
      <div style="padding:20px 24px;">
        <table style="width:100%;border-collapse:collapse;">
          ${row("🕐 Their time", `${info.localTime} <span style="color:#9ca3af;">(${info.timezone})</span>`)}
          ${row("💻 Device", info.device)}
          ${row("🔗 Came from", info.referrer)}
          ${row("🌐 IP hash", `<code style="font-size:12px;color:#6b7280;">${info.ipHash}</code>`)}
          ${row("🤖 Likely bot", info.isBot ? "⚠️ Yes" : "No")}
        </table>
      </div>
      <div style="padding:14px 24px;background:#f9fafb;border-top:1px solid #eef0f3;color:#374151;font-size:14px;">
        Total views: <strong>${totalViews.toLocaleString()}</strong>
      </div>
    </div>
  </div>`;
}

export async function setViewsServerAction() {
  await connectToDatabase();
  const doc = await View.findOneAndUpdate(
    {},
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );

  const totalViews = doc?.views ?? 1;

  let info: VisitorInfo;
  try {
    info = await collectVisitorInfo();
  } catch {
    info = fallbackVisitorInfo();
  }

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: `👀 New visit${info.location !== "Unknown" ? ` — ${info.location}` : ""}`,
    html: buildEmailHtml(info, totalViews),
    text: `New portfolio visit!
Location: ${info.location}
Their time: ${info.localTime} (${info.timezone})
Device: ${info.device}
Came from: ${info.referrer}
IP hash: ${info.ipHash}
Likely bot: ${info.isBot ? "Yes" : "No"}
Total views: ${totalViews}`,
  });

  return { success: true };
}

export async function addViewsServerAction() {
  return setViewsServerAction();
}
