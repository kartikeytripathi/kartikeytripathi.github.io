"use server";

import { connectToDatabase } from "@/lib/database";
import Message from "@/model/message.model";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendMessageInput = {
  name?: string;
  email?: string;
  message: string;
  company?: string; // honeypot — humans never fill this
};

export async function sendMessageServerAction(input: SendMessageInput) {
  // Honeypot tripped — pretend success so bots don't adapt
  if (input.company) return { success: true };

  const message = (input.message || "").trim();
  const name = (input.name || "").trim().slice(0, 80);
  const email = (input.email || "").trim().slice(0, 120);

  if (message.length < 10) {
    return { success: false, error: "Message is too short (min 10 characters)." };
  }
  if (message.length > 1000) {
    return { success: false, error: "Message is too long (max 1000 characters)." };
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "That email doesn't look valid." };
  }

  await connectToDatabase();
  await Message.create({ name, email, message });

  await resend.emails.send({
    from: "portfolio@kartikeytripathi.in",
    to: "kartikey.tripathi.37@gmail.com",
    ...(email && { replyTo: email }),
    subject: `💬 New message from ${name || "anonymous"} on your portfolio`,
    text: [
      `From: ${name || "anonymous"}${email ? ` <${email}>` : " (no email left)"}`,
      "",
      message,
    ].join("\n"),
  });

  return { success: true };
}
