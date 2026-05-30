"use client";

import { useState, FormEvent } from "react";

export default function NewsletterForm({ placeholder = "your@email.com" }: { placeholder?: string }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setEmail("");
      } else {
        setError(data.error || "Something went wrong");
      }
    } catch {
      setError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <p className="font-ui text-sm text-accent">
        ✓ You&apos;re in. First article incoming.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-0">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={placeholder}
          required
          disabled={loading}
          className="flex-1 bg-elevated border border-border text-text-primary font-body text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-accent disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-accent text-[#0C0C0C] font-ui text-sm font-semibold px-6 py-3 hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Subscribing..." : "Subscribe →"}
        </button>
      </div>
      {error && (
        <p className="font-ui text-xs text-red-400 mt-2">{error}</p>
      )}
    </form>
  );
}
