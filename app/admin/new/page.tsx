"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";

// Dynamic import MDEditor to avoid SSR issues
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [published, setPublished] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  // Auto-generate slug from title (unless user manually edited it)
  useEffect(() => {
    if (!slugEdited && title) {
      setSlug(slugify(title));
    }
  }, [title, slugEdited]);

  // Article stats
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));
  const charCount = content.length;

  const showToast = useCallback((message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const handleSave = async (isPublish: boolean) => {
    if (!title || !content) {
      showToast("Title and content are required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          excerpt,
          content,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
          published: isPublish,
          reading_time_minutes: readTime,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast(data.error || "Failed to save");
        return;
      }

      showToast(isPublish ? "Published!" : "Saved as draft");
      setTimeout(() => router.push("/admin"), 600);
    } catch {
      showToast("Network error — try again");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-49px)]">
      {/* Top bar */}
      <div className="flex items-center px-4 py-2.5 border-b border-border shrink-0">
        <Link
          href="/admin"
          className="font-ui text-xs text-text-muted hover:text-accent transition-colors shrink-0"
        >
          ← Articles
        </Link>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title..."
          className="flex-1 mx-8 bg-transparent border-0 font-display text-xl text-text-primary placeholder:text-text-muted focus:outline-none"
        />

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="border border-border text-text-secondary font-ui text-xs px-4 py-2 hover:border-accent hover:text-accent transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="bg-accent text-[#0C0C0C] font-ui text-xs font-semibold px-4 py-2 hover:bg-accent/90 transition-colors cursor-pointer disabled:opacity-50"
          >
            {saving ? "Saving…" : "Publish"}
          </button>
        </div>
      </div>

      {/* Two-pane layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left pane: Markdown editor */}
        <div className="flex-[6] min-w-0" data-color-mode="dark">
          <MDEditor
            value={content}
            onChange={(val) => setContent(val || "")}
            height="100%"
            preview="edit"
            hideToolbar={false}
            style={{ height: "100%" }}
          />
        </div>

        {/* Right pane: Settings */}
        <aside className="flex-[4] overflow-y-auto bg-surface border-l border-border p-6">
          <p className="font-ui text-xs tracking-widest text-text-muted uppercase mb-6">
            Article Settings
          </p>

          {/* Excerpt */}
          <div className="mb-6">
            <label className="block font-ui text-xs text-text-muted uppercase tracking-wide mb-2">
              Excerpt
            </label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              maxLength={160}
              className="w-full bg-elevated border border-border text-text-secondary font-body text-xs p-3 resize-none h-20 focus:outline-none focus:border-accent"
            />
            <p className="font-ui text-xs text-text-muted text-right">
              {excerpt.length}/160
            </p>
          </div>

          {/* Tags */}
          <div className="mb-6">
            <label className="block font-ui text-xs text-text-muted uppercase tracking-wide mb-2">
              Tags
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full bg-elevated border border-border text-text-secondary font-body text-xs p-3 focus:outline-none focus:border-accent"
            />
            <p className="font-ui text-xs text-text-muted mt-1">
              Comma separated: System Design, Backend
            </p>
          </div>

          {/* Reading time (auto) */}
          <div className="mb-6">
            <label className="block font-ui text-xs text-text-muted uppercase tracking-wide mb-2">
              Reading Time
            </label>
            <p className="font-ui text-xs text-text-secondary">
              {readTime} min read
            </p>
          </div>

          {/* Slug */}
          <div className="mb-6">
            <label className="block font-ui text-xs text-text-muted uppercase tracking-wide mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                setSlugEdited(true);
              }}
              className="w-full bg-elevated border border-border text-text-secondary font-body text-xs p-3 focus:outline-none focus:border-accent"
            />
            <p className="font-ui text-xs text-text-muted mt-1">
              algormn.in/articles/{slug || "..."}
            </p>
          </div>

          {/* Published toggle */}
          <div className="mb-6">
            <label className="block font-ui text-xs text-text-muted uppercase tracking-wide mb-2">
              Status
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={published}
                onClick={() => setPublished(!published)}
                className={`relative w-10 h-5 rounded-full transition-colors cursor-pointer ${
                  published ? "bg-accent" : "bg-elevated border border-border"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full transition-transform ${
                    published
                      ? "translate-x-5 bg-[#0C0C0C]"
                      : "translate-x-0 bg-text-muted"
                  }`}
                />
              </button>
              <span
                className={`font-ui text-xs ${
                  published ? "text-accent" : "text-text-muted"
                }`}
              >
                {published ? "Published" : "Draft"}
              </span>
            </div>
          </div>

          <hr className="border-border my-6" />

          {/* Article stats */}
          <div className="space-y-2">
            <p className="font-ui text-xs text-text-muted">
              Word count: {wordCount}
            </p>
            <p className="font-ui text-xs text-text-muted">
              Est. read time: {readTime} min
            </p>
            <p className="font-ui text-xs text-text-muted">
              Characters: {charCount}
            </p>
          </div>
        </aside>
      </div>

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border text-text-secondary font-ui text-xs px-4 py-3 animate-fade-in-up z-50">
          {toast}
        </div>
      )}
    </div>
  );
}
