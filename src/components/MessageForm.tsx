"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiSend, FiCheck } from "react-icons/fi";
import { sendMessageServerAction } from "@/app/api/messageActions";

const COOLDOWN_MS = 60_000;

export function MessageForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "sending" || status === "sent") return;

    const lastSent = Number(localStorage.getItem("messageSentAt") || 0);
    if (Date.now() - lastSent < COOLDOWN_MS) {
      setError("You just sent a message — give it a minute before sending another.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError("");

    try {
      const res = await sendMessageServerAction({ name, email, message, company });
      if (res.success) {
        setStatus("sent");
        localStorage.setItem("messageSentAt", String(Date.now()));
        setName("");
        setEmail("");
        setMessage("");
      } else {
        setStatus("error");
        setError(res.error || "Something went wrong — try again.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't send right now — try again in a bit.");
    }
  };

  const inputClasses =
    "w-full bg-gray-900/40 border border-blue-700/40 rounded-sm px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-blue-500/70 transition-colors duration-300";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      viewport={{ once: true }}
      onSubmit={handleSubmit}
      className="max-w-xl mx-auto w-full mt-10 text-left space-y-3"
    >
      <p className="text-sm font-mono text-gray-400 text-center mb-4">
        — or drop me a note right here —
      </p>

      {/* Honeypot — visually hidden, tab-skipped; bots auto-fill it */}
      <input
        type="text"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name (optional)"
          maxLength={80}
          className={inputClasses}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional — if you want a reply)"
          maxLength={120}
          className={inputClasses}
        />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Say anything — feedback, a question, a hello…"
        required
        minLength={10}
        maxLength={1000}
        rows={4}
        className={`${inputClasses} resize-none`}
      />

      <div className="flex items-center justify-between gap-4">
        <span className="text-xs font-mono text-gray-600">
          {message.length}/1000
        </span>
        <motion.button
          whileHover={status === "idle" || status === "error" ? { scale: 1.03 } : undefined}
          whileTap={status === "idle" || status === "error" ? { scale: 0.97 } : undefined}
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className={`flex items-center gap-2 border py-2 px-5 rounded-sm text-sm transition-all duration-300 ${
            status === "sent"
              ? "border-green-600/60 text-green-400 cursor-default"
              : "border-blue-700/50 text-blue-300 hover:bg-blue-900/30 disabled:opacity-60"
          }`}
        >
          {status === "sent" ? (
            <>
              <FiCheck className="w-4 h-4" />
              Sent — thank you!
            </>
          ) : (
            <>
              <FiSend className="w-4 h-4" />
              {status === "sending" ? "Sending…" : "Send message"}
            </>
          )}
        </motion.button>
      </div>

      {status === "error" && error && (
        <p className="text-xs text-red-400 text-right">{error}</p>
      )}
    </motion.form>
  );
}
