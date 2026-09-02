"use server";

import { connectToDatabase } from "@/lib/database";
import BlogLike from "@/model/blogLike.model";
import BlogComment from "@/model/blogComment.model";
import { blogPosts } from "@/config/blog";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: `❤️ Someone liked "${slug}"`,
    text: `A reader liked your post "${slug}". Total likes: ${doc.count}`,
  });

  return { success: true, count: doc.count };
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

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    subject: `💬 New comment on "${post?.title ?? slug}"`,
    text: `${cleanName} commented on "${post?.title ?? slug}":\n\n${cleanMessage}`,
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
