import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleBody from "@/components/ArticleBody";
import NewsletterForm from "@/components/NewsletterForm";

export const revalidate = 300;
export const dynamicParams = true;

/* ── Types ──────────────────────────────────────────────────── */

interface MockArticle {
  title: string;
  tag: string;
  excerpt: string;
  readTime: number;
  date: string;
  slug: string;
  content: string;
}

/* ── Mock Data ──────────────────────────────────────────────── */

const MOCK_ARTICLES: Record<string, MockArticle> = {
  "consistent-hashing": {
    title:
      "How Consistent Hashing Distributes Load Without Reshuffling Everything",
    tag: "System Design",
    excerpt:
      "Most engineers know consistent hashing exists. Few know exactly why it was invented.",
    readTime: 9,
    date: "May 28, 2026",
    slug: "consistent-hashing",
    content: `## The Problem With Naive Hashing

When you have 4 servers and need to distribute keys, the obvious approach is:

\`\`\`
server = hash(key) % number_of_servers
\`\`\`

This works perfectly — until you add or remove a server. When \`number_of_servers\` changes from 4 to 5, almost every key maps to a different server. In a cache, that means a near-total cache miss storm.

## The Ring

Consistent hashing solves this by mapping both servers and keys onto a circular ring of hash values (typically 0 to 2³²-1).

\`\`\`
Ring positions (0 to 2^32):

  ServerA → hash("ServerA") = 12%
  ServerB → hash("ServerB") = 37%
  ServerC → hash("ServerC") = 63%
  ServerD → hash("ServerD") = 89%
\`\`\`

To find which server owns a key, you hash the key and walk clockwise until you hit a server.

## What Happens When a Server Dies

Only the keys that were owned by the dead server need to move — they go to the next server clockwise. Every other key stays exactly where it is.

This is the core insight: **O(K/N) keys move** instead of O(K) keys.

## Virtual Nodes

Real implementations don't place each server at one position. They place each server at hundreds of positions (virtual nodes). This ensures even distribution even when servers have different capacities.

\`\`\`typescript
function addServer(serverName: string, vnodes: number = 150) {
  for (let i = 0; i < vnodes; i++) {
    const position = hash(\`\${serverName}#\${i}\`)
    ring.set(position, serverName)
  }
}
\`\`\`

## Where It's Used

- **DynamoDB** — consistent hashing across storage nodes
- **Cassandra** — token ring is consistent hashing
- **Nginx** — consistent hashing upstream module for load balancing
- **CDN routing** — route requests to nearest/least-loaded edge node

The next time a node disappears at 3am and your cache doesn't explode, thank consistent hashing.`,
  },

  "postgres-mvcc": {
    title: "Why PostgreSQL Uses MVCC Instead of Locking",
    tag: "Database Internals",
    excerpt: "Locks block. MVCC lets readers and writers coexist.",
    readTime: 11,
    date: "May 21, 2026",
    slug: "postgres-mvcc",
    content: `## What MVCC Solves

In a lock-based system, a reader blocks a writer and a writer blocks a reader. MVCC eliminates this entirely.

## How It Works

Every row in Postgres has two hidden columns: \`xmin\` (the transaction that created it) and \`xmax\` (the transaction that deleted it).

\`\`\`sql
SELECT xmin, xmax, * FROM your_table LIMIT 5;
\`\`\`

When you update a row, Postgres does not modify it in place. It marks the old row as deleted (sets xmax) and inserts a new row version. Both versions coexist on disk briefly.

## Snapshots

Every transaction gets a snapshot — a list of which transaction IDs were active when it started. A row is visible to your transaction only if it was created by a committed transaction that precedes your snapshot, and not deleted by one.

## The Cost: Bloat

Dead row versions pile up. This is why Postgres needs \`VACUUM\` — a background process that reclaims space from dead tuples.

\`\`\`sql
-- Check dead tuple count
SELECT relname, n_dead_tup, n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
\`\`\`

Readers see a consistent point-in-time view. Writers create new versions. They never collide. The tradeoff is disk bloat and the need for vacuuming.`,
  },

  "skip-lists": {
    title: "The Skip List: Probabilistic but Faster Than You Think",
    tag: "DSA",
    excerpt:
      "Redis uses a skip list for its sorted sets. Here is why a probabilistic data structure beats a balanced BST in practice.",
    readTime: 7,
    date: "May 14, 2026",
    slug: "skip-lists",
    content: `## Why Not a Balanced BST?

Red-black trees and AVL trees guarantee O(log n) operations. So does a skip list — probabilistically. The difference is implementation complexity. A red-black tree insert requires dozens of rotation cases. A skip list insert is coin flips and pointer updates.

## The Structure

A skip list is a layered linked list. The bottom layer contains all elements. Each higher layer is a random subset of the layer below, acting as an "express lane."

\`\`\`
Level 3:  1 ────────────────────── 9
Level 2:  1 ──────── 4 ────────── 9
Level 1:  1 ── 3 ── 4 ── 6 ── 7 ── 9
Level 0:  1  2  3  4  5  6  7  8  9
\`\`\`

## Searching

Start at the top-left. Move right until the next node is greater than your target, then drop down. Repeat. Expected time: O(log n).

## Insertion With Coin Flips

When inserting a new element, flip a coin to decide its height. Heads = promote to next level. Keep flipping until tails.

\`\`\`typescript
function randomLevel(): number {
  let level = 0;
  while (Math.random() < 0.5 && level < MAX_LEVEL) {
    level++;
  }
  return level;
}
\`\`\`

This probabilistic approach gives the same expected performance as a balanced tree, without the complexity of rebalancing.

## Where Redis Uses It

Redis sorted sets (\`ZADD\`, \`ZRANGEBYSCORE\`) are backed by a skip list combined with a hash table. The skip list handles range queries efficiently, while the hash table provides O(1) point lookups.`,
  },

  "rate-limiting": {
    title: "Rate Limiting at Scale: Token Bucket vs Sliding Window",
    tag: "Backend",
    excerpt:
      "Every API needs rate limiting. The algorithm you pick changes your memory usage, accuracy, and burst behaviour at scale.",
    readTime: 8,
    date: "May 7, 2026",
    slug: "rate-limiting",
    content: `## Why Rate Limiting Matters

Without rate limiting, a single user can consume all your API capacity. Rate limiting protects your backend, ensures fairness, and prevents abuse.

## Token Bucket

Imagine a bucket that holds tokens. Tokens are added at a steady rate. Each request removes one token. If the bucket is empty, the request is rejected.

\`\`\`typescript
class TokenBucket {
  tokens: number;
  maxTokens: number;
  refillRate: number; // tokens per second
  lastRefill: number;

  allow(): boolean {
    this.refill();
    if (this.tokens > 0) {
      this.tokens--;
      return true;
    }
    return false;
  }

  refill() {
    const now = Date.now();
    const elapsed = (now - this.lastRefill) / 1000;
    this.tokens = Math.min(this.maxTokens, this.tokens + elapsed * this.refillRate);
    this.lastRefill = now;
  }
}
\`\`\`

Token bucket allows bursts up to the bucket size, then enforces the steady rate. This is what AWS and Stripe use.

## Sliding Window Log

Track the timestamp of every request. Count requests in the last N seconds. This is perfectly accurate but memory-expensive — you store every timestamp.

## Sliding Window Counter

A hybrid: divide time into fixed windows, but interpolate between the current and previous window to approximate a sliding count. Much less memory than the log approach.

\`\`\`
Rate: 100 req/min
Previous window (00:00–01:00): 84 requests
Current window  (01:00–02:00): 36 requests
Current position: 01:15 (25% into window)

Estimate = 84 * 0.75 + 36 = 99 → allow
\`\`\`

The choice depends on your tolerance for bursts and your memory budget.`,
  },

  "kafka-ordering": {
    title: "How Kafka Guarantees Message Ordering",
    tag: "Distributed Systems",
    excerpt:
      "Ordering in a distributed log sounds simple. It is not. Here is exactly what Kafka guarantees, what it does not, and why.",
    readTime: 10,
    date: "Apr 30, 2026",
    slug: "kafka-ordering",
    content: `## The Guarantee

Kafka guarantees ordering **within a partition**, not across partitions. This is the single most important thing to understand about Kafka.

## How Partitions Work

A topic is divided into partitions. Each partition is an ordered, immutable log. Messages are appended to the end and assigned a sequential offset.

\`\`\`
Topic: orders (3 partitions)

Partition 0: [msg0, msg3, msg6, msg9 ...]
Partition 1: [msg1, msg4, msg7, msg10 ...]
Partition 2: [msg2, msg5, msg8, msg11 ...]
\`\`\`

## Choosing the Right Partition Key

The partition key determines which partition a message goes to. If you need ordering for all events related to one user, use the user ID as the partition key.

\`\`\`java
producer.send(new ProducerRecord<>(
    "orders",        // topic
    userId,          // key → determines partition
    orderEvent       // value
));
\`\`\`

All messages with the same key go to the same partition, so they are processed in order.

## What Breaks Ordering

- **Producer retries** with \`max.in.flight.requests.per.connection > 1\` can reorder messages. Set it to 1 for strict ordering, or enable idempotence (\`enable.idempotence=true\`).
- **Consumer rebalancing** can cause temporary out-of-order processing if offsets aren't committed properly.
- **Repartitioning** a topic changes key-to-partition mappings.

## The Tradeoff

More partitions = more parallelism but less ordering. Fewer partitions = stronger ordering but less throughput. Design your partition key around the entity that needs ordered processing.`,
  },

  "b-trees": {
    title: "B-Trees: Why Every Database Uses Them",
    tag: "Database Internals",
    excerpt:
      "Hash maps are faster at point lookups. So why does every major database default to a B-Tree index? The answer is range queries.",
    readTime: 12,
    date: "Apr 23, 2026",
    slug: "b-trees",
    content: `## The Problem With Hash Indexes

A hash index gives O(1) point lookups. But try running \`WHERE age BETWEEN 25 AND 35\` on a hash index. You can't — there's no ordering. You'd have to scan every bucket.

## What a B-Tree Provides

A B-Tree keeps keys sorted. This enables:
- Point lookups: O(log n)
- Range queries: O(log n + k) where k is the result count
- Prefix matching, ORDER BY, MIN/MAX — all efficient

## The Structure

A B-Tree of order M means each node holds up to M-1 keys and M children. Nodes are designed to match disk page sizes (typically 4KB or 8KB).

\`\`\`
          [17 | 35]              ← root
         /    |    \\
   [5|11]  [23|29]  [42|48|56]   ← internal nodes
   / | \\    / | \\    / | | \\
  ← leaf nodes with actual data →
\`\`\`

## Why Disk Layout Matters

Each node read is a disk I/O. A B-Tree with branching factor 500 can index 125 million keys in just 3 levels — meaning 3 disk reads for any lookup.

\`\`\`python
import math

branching_factor = 500
keys = 125_000_000
levels = math.ceil(math.log(keys, branching_factor))
print(f"Levels: {levels}")  # 3
print(f"Disk reads per lookup: {levels}")  # 3
\`\`\`

## B+ Tree Variant

Most databases (Postgres, MySQL InnoDB) actually use B+ Trees, where all data lives in leaf nodes and leaf nodes are linked together. This makes range scans a simple linked-list traversal.

## The Tradeoff

Writes are more expensive than a hash index because the tree must be rebalanced. But for mixed read-write workloads with range queries, nothing beats a B-Tree.`,
  },

  "url-shortener": {
    title: "Designing a URL Shortener That Handles 100k Writes/sec",
    tag: "System Design",
    excerpt:
      "A URL shortener is the hello world of system design interviews. Here is what a real implementation at scale actually looks like.",
    readTime: 14,
    date: "Apr 16, 2026",
    slug: "url-shortener",
    content: `## Requirements at Scale

100k writes/sec means ~8.6 billion new URLs per day. Read traffic is typically 10x writes, so ~1M reads/sec. You need a system that generates unique short codes fast and redirects even faster.

## Short Code Generation

A 7-character base62 code gives 62⁷ = 3.5 trillion possible URLs. That's enough for decades.

\`\`\`typescript
const BASE62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

function encode(num: bigint): string {
  let result = '';
  while (num > 0n) {
    result = BASE62[Number(num % 62n)] + result;
    num = num / 62n;
  }
  return result.padStart(7, '0');
}
\`\`\`

## ID Generation Strategy

Use a distributed counter (e.g., Twitter Snowflake) that guarantees uniqueness across multiple data centers without coordination.

\`\`\`
| 1 bit unused | 41 bits timestamp | 5 bits DC | 5 bits machine | 12 bits sequence |
\`\`\`

This gives each machine 4096 unique IDs per millisecond with no coordination.

## Read Path: Cache Everything

The redirect path must be fast. Use a multi-tier cache:

1. **CDN** — cache 301 redirects at edge
2. **Redis** — in-memory cache for hot URLs
3. **Database** — source of truth for cold URLs

Most URL shorteners follow the Pareto principle: 20% of URLs generate 80% of traffic. A Redis cache with LRU eviction handles this naturally.

## The 301 vs 302 Decision

- **301 Moved Permanently** — browser caches it, reduces server load, but you lose analytics
- **302 Found** — every click hits your server, letting you track clicks

Most production shorteners use 302 for analytics, with aggressive CDN caching for popular URLs.`,
  },

  "two-phase-commit": {
    title: "Two-Phase Commit: Why Distributed Transactions Are Hard",
    tag: "Distributed Systems",
    excerpt:
      "2PC is the standard protocol for distributed transactions. It also has a fundamental flaw.",
    readTime: 9,
    date: "Apr 9, 2026",
    slug: "two-phase-commit",
    content: `## The Problem

You need to debit Account A on Server 1 and credit Account B on Server 2. Both must succeed, or both must fail. How do you coordinate this across two independent servers?

## Phase 1: Prepare

The coordinator asks each participant: "Can you commit?" Each participant writes the transaction to its write-ahead log and replies YES or NO.

\`\`\`
Coordinator → Server1: PREPARE
Coordinator → Server2: PREPARE
Server1 → Coordinator: YES (written to WAL)
Server2 → Coordinator: YES (written to WAL)
\`\`\`

## Phase 2: Commit

If all participants said YES, the coordinator sends COMMIT. If any said NO, it sends ABORT.

\`\`\`
Coordinator → Server1: COMMIT
Coordinator → Server2: COMMIT
Server1 → Coordinator: ACK
Server2 → Coordinator: ACK
\`\`\`

## The Blocking Problem

If the coordinator crashes between Phase 1 and Phase 2, participants are stuck. They've promised to commit (locked their resources) but don't know the final decision. They must wait — potentially forever — for the coordinator to recover.

\`\`\`
Timeline:
  Server1: PREPARED ──── waiting... ──── waiting...
  Coordinator: ──── CRASH ────
  Server2: PREPARED ──── waiting... ──── waiting...
\`\`\`

This is why 2PC is called a **blocking protocol**. The Paxos and Raft consensus algorithms solve this by allowing progress even when nodes fail, at the cost of more complexity.

## Where It's Still Used

Despite its limitations, 2PC is used in:
- **MySQL XA transactions**
- **PostgreSQL prepared transactions**
- **Java's JTA (Java Transaction API)**

The key is that coordinator failures are rare in practice, and the alternatives (Saga, TCC) introduce their own complexity.`,
  },

  "raft-consensus": {
    title:
      "The Raft Consensus Algorithm, Explained From First Principles",
    tag: "Distributed Systems",
    excerpt:
      "Paxos is famously hard to understand. Raft was built to be understandable.",
    readTime: 15,
    date: "Apr 2, 2026",
    slug: "raft-consensus",
    content: `## The Goal

Get a cluster of servers to agree on a sequence of values (a replicated log) even when some servers crash. This is the consensus problem.

## Leader Election

Raft divides time into terms. Each term has at most one leader. If a follower doesn't hear from the leader (election timeout), it becomes a candidate and requests votes.

\`\`\`
Term 1: [Leader: S1] ─── heartbeats ─── crash
Term 2: [Election] S3 wins with majority vote
Term 3: [Leader: S3] ─── heartbeats ───
\`\`\`

A candidate wins by getting votes from a majority. Each server votes at most once per term. This guarantees at most one leader per term.

## Log Replication

The leader accepts client requests, appends them to its log, and replicates them to followers. An entry is committed once a majority of servers have it.

\`\`\`typescript
interface LogEntry {
  term: number;
  index: number;
  command: string;
}

// Leader's log:
// [{ term: 1, index: 1, cmd: "SET x=1" },
//  { term: 1, index: 2, cmd: "SET y=2" },
//  { term: 2, index: 3, cmd: "SET x=3" }]
\`\`\`

## Safety: The Election Restriction

A candidate must have a log at least as up-to-date as the voter's log to win the vote. This ensures the leader always has all committed entries — no data loss.

## Why Raft Works

The key insight is decomposition. Raft splits consensus into three subproblems:
1. **Leader election** — one leader per term
2. **Log replication** — leader to followers
3. **Safety** — election restriction prevents stale leaders

This decomposition is why Raft is teachable. Paxos solves the same problem but as one monolithic protocol.

## Where It's Used

- **etcd** — the backbone of Kubernetes
- **CockroachDB** — distributed SQL
- **Consul** — service mesh by HashiCorp
- **TiKV** — distributed key-value store`,
  },

  "redis-persistence": {
    title: "How Redis Persistence Works: RDB vs AOF",
    tag: "Backend",
    excerpt:
      "Redis is in-memory but it survives restarts. Here is exactly how RDB snapshots and AOF logging work.",
    readTime: 8,
    date: "Mar 26, 2026",
    slug: "redis-persistence",
    content: `## The Problem

Redis stores everything in memory. Memory is volatile. Without persistence, a restart means total data loss.

## RDB: Point-in-Time Snapshots

Redis periodically forks itself and writes the entire dataset to a binary file (\`dump.rdb\`). The fork uses copy-on-write, so the parent process continues serving requests while the child writes.

\`\`\`
redis.conf:
save 900 1      # snapshot if 1+ key changed in 900s
save 300 10     # snapshot if 10+ keys changed in 300s
save 60 10000   # snapshot if 10k+ keys changed in 60s
\`\`\`

**Pro:** Compact files, fast restores, minimal performance impact during normal operations.
**Con:** You lose all writes since the last snapshot. If Redis crashes right before a save, those writes are gone.

## AOF: Append-Only File

Every write command is appended to a log file. On restart, Redis replays the log to reconstruct the dataset.

\`\`\`
# appendonly.aof
*3\\r\\n$3\\r\\nSET\\r\\n$5\\r\\nmykey\\r\\n$7\\r\\nmyvalue\\r\\n
*3\\r\\n$3\\r\\nSET\\r\\n$4\\r\\nfoo\\r\\n$3\\r\\nbar\\r\\n
\`\`\`

The \`appendfsync\` setting controls durability:

\`\`\`
appendfsync always    # fsync every write — safest, slowest
appendfsync everysec  # fsync every second — good tradeoff
appendfsync no        # let the OS decide — fastest, riskiest
\`\`\`

## AOF Rewriting

The AOF file grows forever. Redis compacts it by reading the current dataset and writing the minimal set of commands to reconstruct it. This runs in a background fork, just like RDB.

## Which to Use

| Scenario | Recommendation |
|----------|---------------|
| Cache only | No persistence |
| Can tolerate minutes of loss | RDB only |
| Need durability | AOF with everysec |
| Maximum safety | Both RDB + AOF |

Most production deployments use **both**: AOF for durability, RDB for fast backups and disaster recovery.`,
  },
};

/* ── Static Generation ──────────────────────────────────────── */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  return Object.keys(MOCK_ARTICLES).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];
  if (!article) return { title: "Article Not Found — Algormn" };

  return {
    title: `${article.title} — Algormn`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
    },
  };
}

/* ── Page ───────────────────────────────────────────────────── */

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = MOCK_ARTICLES[slug];
  if (!article) notFound();

  // Get 3 other articles for sidebar
  const moreArticles = Object.values(MOCK_ARTICLES)
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  return (
    <>
      <ReadingProgress />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6">
        {/* Article Header */}
        <header className="max-w-2xl pb-12 pt-16">
          <span className="font-ui text-xs uppercase tracking-widest text-accent bg-transparent border border-accent px-2 py-0.5 inline-block">
            {article.tag}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mt-4 mb-6">
            {article.title}
          </h1>
          <div className="font-ui text-xs text-text-muted flex gap-4 items-center">
            <span>{article.readTime} min read</span>
            <span>·</span>
            <span>{article.date}</span>
          </div>
          <hr className="border-border mt-8" />
        </header>

        {/* Two-column layout */}
        <div className="flex flex-col lg:flex-row gap-12 pb-20">
          {/* Left: Article body */}
          <article className="flex-1 min-w-0 max-w-2xl">
            <ArticleBody content={article.content} />
          </article>

          {/* Right: Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 lg:sticky lg:top-24 lg:self-start space-y-6">
            {/* Author card */}
            <div className="bg-surface border border-border p-6">
              <div className="w-10 h-10 rounded-full bg-elevated border border-border flex items-center justify-center font-display text-base text-accent">
                R
              </div>
              <p className="font-display text-lg text-text-primary mt-3">
                RMN
              </p>
              <p className="font-body text-xs text-text-secondary leading-relaxed mt-2">
                Software Engineer writing about the internals of systems most
                engineers use but never fully understand. One article a week,
                built from first principles.
              </p>
            </div>

            {/* Newsletter card */}
            <div className="bg-surface border border-border p-6">
              <p className="font-display text-base text-text-primary mb-2">
                Get the next one in your inbox
              </p>
              <p className="font-body text-xs text-text-secondary mb-4">
                One deep-dive per week. No spam.
              </p>
              <NewsletterForm />
            </div>

            {/* More articles */}
            <div className="bg-surface border border-border p-6">
              <p className="font-ui text-xs tracking-widest text-text-muted uppercase mb-4">
                More Deep-Dives
              </p>
              <div className="space-y-3">
                {moreArticles.map((a) => (
                  <Link
                    key={a.slug}
                    href={`/articles/${a.slug}`}
                    className="block border-b border-border pb-3 last:border-0 last:pb-0 hover:no-underline group"
                  >
                    <p className="font-display text-sm text-text-primary group-hover:text-accent transition-colors">
                      {a.title}
                    </p>
                    <span className="font-ui text-xs text-text-muted">
                      {a.tag}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </>
  );
}
