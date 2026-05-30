import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleListClient from "@/components/ArticleListClient";

export const revalidate = 60;

/* ── Mock Data ──────────────────────────────────────────────── */

const ALL_ARTICLES = [
  {
    title: "How Consistent Hashing Distributes Load Without Reshuffling Everything",
    tag: "System Design",
    excerpt: "Most engineers know consistent hashing exists. Few know exactly why it was invented, what problem it solves at 3am when a node dies.",
    readTime: 9,
    date: "May 28, 2026",
    slug: "consistent-hashing",
  },
  {
    title: "Why PostgreSQL Uses MVCC Instead of Locking",
    tag: "Database Internals",
    excerpt: "Locks block. MVCC lets readers and writers coexist without stepping on each other. Here is exactly how Postgres implements it under the hood.",
    readTime: 11,
    date: "May 21, 2026",
    slug: "postgres-mvcc",
  },
  {
    title: "The Skip List: Probabilistic but Faster Than You Think",
    tag: "DSA",
    excerpt: "Redis uses a skip list for its sorted sets. Here is why a probabilistic data structure beats a balanced BST in practice.",
    readTime: 7,
    date: "May 14, 2026",
    slug: "skip-lists",
  },
  {
    title: "Rate Limiting at Scale: Token Bucket vs Sliding Window",
    tag: "Backend",
    excerpt: "Every API needs rate limiting. The algorithm you pick changes your memory usage, accuracy, and burst behaviour at scale.",
    readTime: 8,
    date: "May 7, 2026",
    slug: "rate-limiting",
  },
  {
    title: "How Kafka Guarantees Message Ordering",
    tag: "Distributed Systems",
    excerpt: "Ordering in a distributed log sounds simple. It is not. Here is exactly what Kafka guarantees, what it does not, and why.",
    readTime: 10,
    date: "Apr 30, 2026",
    slug: "kafka-ordering",
  },
  {
    title: "B-Trees: Why Every Database Uses Them",
    tag: "Database Internals",
    excerpt: "Hash maps are faster at point lookups. So why does every major database default to a B-Tree index? The answer is range queries.",
    readTime: 12,
    date: "Apr 23, 2026",
    slug: "b-trees",
  },
  {
    title: "Designing a URL Shortener That Handles 100k Writes/sec",
    tag: "System Design",
    excerpt: "A URL shortener is the hello world of system design interviews. Here is what a real implementation at scale actually looks like.",
    readTime: 14,
    date: "Apr 16, 2026",
    slug: "url-shortener",
  },
  {
    title: "Two-Phase Commit: Why Distributed Transactions Are Hard",
    tag: "Distributed Systems",
    excerpt: "2PC is the standard protocol for distributed transactions. It also has a fundamental flaw. Here is what it is and how systems work around it.",
    readTime: 9,
    date: "Apr 9, 2026",
    slug: "two-phase-commit",
  },
  {
    title: "The Raft Consensus Algorithm, Explained From First Principles",
    tag: "Distributed Systems",
    excerpt: "Paxos is famously hard to understand. Raft was built to be understandable. Here is a complete walkthrough of how it achieves consensus.",
    readTime: 15,
    date: "Apr 2, 2026",
    slug: "raft-consensus",
  },
  {
    title: "How Redis Persistence Works: RDB vs AOF",
    tag: "Backend",
    excerpt: "Redis is in-memory but it survives restarts. Here is exactly how RDB snapshots and AOF logging work, and when to use which.",
    readTime: 8,
    date: "Mar 26, 2026",
    slug: "redis-persistence",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function ArticlesPage() {
  return (
    <>
      <Navbar />

      {/* Page Header */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <p className="font-ui text-xs tracking-[0.2em] uppercase text-text-muted">
          All Articles
        </p>
        <h1 className="font-display text-5xl text-text-primary mt-2">
          The Archive
        </h1>
        <p className="font-body text-sm text-text-secondary mt-3">
          Every deep-dive, indexed.
        </p>
        <p className="font-ui text-xs text-text-muted mt-1">
          {ALL_ARTICLES.length} articles
        </p>
      </header>

      {/* Client component: tag filter + grid */}
      <ArticleListClient articles={ALL_ARTICLES} />

      <Footer />
    </>
  );
}
