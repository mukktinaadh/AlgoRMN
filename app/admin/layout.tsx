"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const isAuthed = localStorage.getItem("algormn_admin_authed") === "true";
    setAuthed(isAuthed);
    if (!isAuthed) {
      router.replace("/login");
    }
  }, [router]);

  // Loading state — prevent flash
  if (authed === null) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <p className="font-ui text-xs text-text-muted">Loading…</p>
      </div>
    );
  }

  // Not authed — redirecting
  if (!authed) {
    return null;
  }

  return (
    <div className="min-h-screen bg-base">
      {/* Admin top bar */}
      <nav className="flex items-center justify-between px-6 py-3 border-b border-border">
        <Link href="/admin" className="font-display text-sm text-text-primary">
          Algormn Admin
        </Link>
        <Link
          href="/"
          className="font-ui text-xs text-text-muted hover:text-accent transition-colors"
        >
          ← Back to site
        </Link>
      </nav>
      {children}
    </div>
  );
}
