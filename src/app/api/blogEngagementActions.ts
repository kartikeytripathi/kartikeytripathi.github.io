"use server";

import { connectToDatabase } from "@/lib/database";
import BlogLike from "@/model/blogLike.model";
import BlogComment from "@/model/blogComment.model";
import BlogView from "@/model/blogView.model";
import { blogPosts } from "@/config/blog";
import { Resend } from "resend";
import {
  collectVisitorInfo,
  fallbackVisitorInfo,
  buildVisitorEmailHtml,
} from "@/lib/visitorInfo";

const resend = new Resend(process.env.RESEND_API_KEY);

async function safeCollectVisitorInfo() {
  try {
    return await collectVisitorInfo();
  } catch {
    return fallbackVisitorInfo();
  }
}

function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function assertValidSlug(slug: string) {
  if (!blogPosts.some((p) => p.slug === slug)) {
    throw new Error("Unknown post");
  }
}

export async function getBlogLikeServerAction(slug: string) {
  assertValidSlug(slug);
  await connectToDatabase();
  const doc = await BlogLike.findOne({ slug });
  return { count: doc?.count ?? 0 };
}

export async function addBlogLikeServerAction(slug: string) {
  assertValidSlug(slug);
  await connectToDatabase();
  const doc = await BlogLike.findOneAndUpdate(
    { slug },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );

  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? slug;
  const info = await safeCollectVisitorInfo();

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: `❤️ Someone liked "${title}"${info.location !== "Unknown" ? ` — ${info.location}` : ""}`,
    html: buildVisitorEmailHtml({
      emoji: "❤️",
      eventLabel: "New like on your post",
      headline: title,
      info,
      footerLabel: "Total likes",
      footerValue: String(doc.count),
    }),
    text: `A reader liked your post "${title}".
Location: ${info.location}
Their time: ${info.localTime} (${info.timezone})
Device: ${info.device}
Came from: ${info.referrer}
IP hash: ${info.ipHash}
Likely bot: ${info.isBot ? "Yes" : "No"}
Total likes: ${doc.count}`,
  });

  return { success: true, count: doc.count };
}

export async function getBlogViewsServerAction(slug: string) {
  assertValidSlug(slug);
  await connectToDatabase();
  const doc = await BlogView.findOne({ slug });
  return { views: doc?.views ?? 0 };
}

// No email notification here — unlike likes/comments, views fire on every
// unique visit and would flood the inbox at any real traffic volume.
export async function addBlogViewServerAction(slug: string) {
  assertValidSlug(slug);
  await connectToDatabase();
  const doc = await BlogView.findOneAndUpdate(
    { slug },
    { $inc: { views: 1 } },
    { upsert: true, new: true }
  );
  return { success: true, views: doc.views };
}

export type BlogCommentDTO = {
  id: string;
  name: string;
  message: string;
  createdAt: string;
};

export async function getBlogCommentsServerAction(
  slug: string
): Promise<{ comments: BlogCommentDTO[] }> {
  assertValidSlug(slug);
  await connectToDatabase();
  const docs = await BlogComment.find({ slug }).sort({ createdAt: -1 }).lean();
  return {
    comments: docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      message: d.message,
      createdAt: d.createdAt.toISOString(),
    })),
  };
}

export async function addBlogCommentServerAction(
  slug: string,
  name: string,
  message: string,
  honeypot?: string
) {
  assertValidSlug(slug);

  // Honeypot: bots fill every field, real visitors never see this one.
  if (honeypot) {
    return { success: true };
  }

  const cleanName = name.trim().slice(0, 60);
  const cleanMessage = message.trim().slice(0, 1000);

  if (!cleanName || !cleanMessage) {
    throw new Error("Name and comment are required");
  }

  await connectToDatabase();
  const doc = await BlogComment.create({
    slug,
    name: cleanName,
    message: cleanMessage,
  });

  const post = blogPosts.find((p) => p.slug === slug);
  const title = post?.title ?? slug;
  const info = await safeCollectVisitorInfo();

  const commentBlockHtml = `
    <div style="padding:16px 24px 0;">
      <div style="background:#f9fafb;border-left:3px solid #8b5cf6;border-radius:6px;padding:12px 14px;">
        <div style="font-size:13px;font-weight:600;color:#111827;margin-bottom:4px;">${escapeHtml(cleanName)}</div>
        <div style="font-size:14px;color:#374151;white-space:pre-wrap;">${escapeHtml(cleanMessage)}</div>
      </div>
    </div>`;

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: `💬 New comment on "${title}"${info.location !== "Unknown" ? ` — ${info.location}` : ""}`,
    html: buildVisitorEmailHtml({
      emoji: "💬",
      eventLabel: "New comment on your post",
      headline: title,
      info,
      bodyHtml: commentBlockHtml,
    }),
    text: `${cleanName} commented on "${title}":

${cleanMessage}

Location: ${info.location}
Their time: ${info.localTime} (${info.timezone})
Device: ${info.device}
Came from: ${info.referrer}
IP hash: ${info.ipHash}
Likely bot: ${info.isBot ? "Yes" : "No"}`,
  });

  return {
    success: true,
    comment: {
      id: String(doc._id),
      name: doc.name,
      message: doc.message,
      createdAt: doc.createdAt.toISOString(),
    } satisfies BlogCommentDTO,
  };
}
