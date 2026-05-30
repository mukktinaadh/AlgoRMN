"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (password === "algormn2026") {
      localStorage.setItem("algormn_admin_authed", "true");
      router.replace("/admin");
    } else {
      setError("Incorrect password");
    }
  };

  return (
    <div className="min-h-screen bg-base flex items-center justify-center px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-xs">
        <p className="font-display text-2xl text-text-primary mb-8 text-center">
          Algormn
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError("");
          }}
          placeholder="Admin password"
          autoFocus
          className="w-full bg-elevated border border-border text-text-primary font-body text-sm px-4 py-3 placeholder:text-text-muted focus:outline-none focus:border-accent mb-3"
        />

        <button
          type="submit"
          className="w-full bg-accent text-[#0C0C0C] font-ui text-sm font-semibold px-6 py-3 hover:bg-accent/90 transition-colors cursor-pointer"
        >
          Enter
        </button>

        {error && (
          <p className="font-ui text-xs text-red-400 mt-3 text-center">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
