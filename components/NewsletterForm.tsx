"use client";

import { useState } from "react";

interface NewsletterFormProps {
  placeholder?: string;
}

export default function NewsletterForm({
  placeholder = "your@email.com",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    // TODO: Wire to /api/subscribe
    console.log("Subscribe:", email);
    setTimeout(() => {
      setStatus("success");
      setEmail("");
    }, 600);
  };

  if (status === "success") {
    return (
      <p className="font-ui text-sm text-accent">
        ✓ You&apos;re subscribed. Welcome aboard.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-0">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={placeholder}
        required
        className="flex-1 bg-elevated border border-border text-text-primary font-ui text-sm px-4 py-3 rounded-none placeholder:text-text-muted focus:outline-none focus:border-accent transition-colors"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-accent text-[#0C0C0C] font-ui font-semibold text-sm px-6 py-3 rounded-none hover:bg-accent-hover transition-colors cursor-pointer disabled:opacity-50"
      >
        {status === "loading" ? "..." : "Subscribe →"}
      </button>
    </form>
  );
}
