"use client";

import Link from "next/link";

/* ── Mock data (mirrors article detail page data) ────────── */
const MOCK_ARTICLES = [
  { title: "How Consistent Hashing Distributes Load Without Reshuffling Everything", tag: "System Design", readTime: 9, date: "May 28, 2026", slug: "consistent-hashing", published: true },
  { title: "Why PostgreSQL Uses MVCC Instead of Locking", tag: "Database Internals", readTime: 11, date: "May 21, 2026", slug: "postgres-mvcc", published: true },
  { title: "The Skip List: Probabilistic but Faster Than You Think", tag: "DSA", readTime: 7, date: "May 14, 2026", slug: "skip-lists", published: true },
  { title: "Rate Limiting at Scale: Token Bucket vs Sliding Window", tag: "Backend", readTime: 8, date: "May 7, 2026", slug: "rate-limiting", published: true },
  { title: "How Kafka Guarantees Message Ordering", tag: "Distributed Systems", readTime: 10, date: "Apr 30, 2026", slug: "kafka-ordering", published: true },
  { title: "B-Trees: Why Every Database Uses Them", tag: "Database Internals", readTime: 12, date: "Apr 23, 2026", slug: "b-trees", published: true },
  { title: "Designing a URL Shortener That Handles 100k Writes/sec", tag: "System Design", readTime: 14, date: "Apr 16, 2026", slug: "url-shortener", published: true },
  { title: "Two-Phase Commit: Why Distributed Transactions Are Hard", tag: "Distributed Systems", readTime: 9, date: "Apr 9, 2026", slug: "two-phase-commit", published: true },
  { title: "The Raft Consensus Algorithm, Explained From First Principles", tag: "Distributed Systems", readTime: 15, date: "Apr 2, 2026", slug: "raft-consensus", published: true },
  { title: "How Redis Persistence Works: RDB vs AOF", tag: "Backend", readTime: 8, date: "Mar 26, 2026", slug: "redis-persistence", published: true },
];

export default function AdminDashboard() {
  const handleDelete = (slug: string) => {
    if (window.confirm(`Delete "${slug}"? This cannot be undone.`)) {
      console.log("Delete:", slug);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl text-text-primary">Articles</h1>
        <Link
          href="/admin/new"
          className="bg-accent text-[#0C0C0C] font-ui text-sm font-semibold px-4 py-2 rounded-none hover:bg-accent/90 transition-colors"
        >
          New Article
        </Link>
      </div>

      {/* Articles table */}
      {MOCK_ARTICLES.length === 0 ? (
        <p className="text-center font-body text-sm text-text-muted py-20">
          No articles yet. Write your first one.
        </p>
      ) : (
        <div className="border border-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_140px_80px_100px_100px] gap-4 px-4 py-3 bg-elevated border-b border-border">
            <span className="font-ui text-xs text-text-muted uppercase tracking-wide">
              Title
            </span>
            <span className="font-ui text-xs text-text-muted uppercase tracking-wide">
              Tag
            </span>
            <span className="font-ui text-xs text-text-muted uppercase tracking-wide">
              Time
            </span>
            <span className="font-ui text-xs text-text-muted uppercase tracking-wide">
              Date
            </span>
            <span className="font-ui text-xs text-text-muted uppercase tracking-wide text-right">
              Actions
            </span>
          </div>

          {/* Table rows */}
          {MOCK_ARTICLES.map((article) => (
            <div
              key={article.slug}
              className="grid grid-cols-[1fr_140px_80px_100px_100px] gap-4 px-4 py-3 border-b border-border last:border-0 hover:bg-surface transition-colors items-center"
            >
              <span className="font-body text-sm text-text-primary truncate">
                {article.title}
              </span>
              <span className="font-ui text-xs text-accent uppercase tracking-wide border border-accent px-1.5 py-0.5 inline-block w-fit truncate">
                {article.tag}
              </span>
              <span className="font-ui text-xs text-text-muted">
                {article.readTime} min
              </span>
              <span className="font-ui text-xs text-text-muted">
                {article.date}
              </span>
              <div className="flex gap-3 justify-end">
                <Link
                  href={`/admin/edit/${article.slug}`}
                  className="font-ui text-xs text-accent hover:underline"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(article.slug)}
                  className="font-ui text-xs text-red-400 hover:underline cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
