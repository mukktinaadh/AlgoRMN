INSERT INTO articles (title, slug, excerpt, content, published, published_at, reading_time_minutes) VALUES
(
  'How Consistent Hashing Distributes Load Without Reshuffling Everything',
  'consistent-hashing',
  'Most engineers know consistent hashing exists. Few know exactly why it was invented, what problem it solves at 3am when a node dies.',
  '## The Problem With Naive Hashing

When you have 4 servers and need to distribute keys, the obvious approach is:
server = hash(key) % number_of_servers


This works perfectly — until you add or remove a server. When `number_of_servers` changes from 4 to 5, almost every key maps to a different server. In a cache, that means a near-total cache miss storm.

## The Ring

Consistent hashing solves this by mapping both servers and keys onto a circular ring of hash values from 0 to 2³²-1. To find which server owns a key, you hash the key and walk clockwise until you hit a server.

## What Happens When a Server Dies

Only the keys that were owned by the dead server need to move. Every other key stays exactly where it is. This is the core insight: **O(K/N) keys move** instead of O(K) keys.

## Where It''s Used

- **DynamoDB** — consistent hashing across storage nodes
- **Cassandra** — token ring is consistent hashing
- **Nginx** — consistent hashing upstream module
',
  true,
  now() - interval '2 days',
  9
),
(
  'Why PostgreSQL Uses MVCC Instead of Locking',
  'postgres-mvcc',
  'Locks block. MVCC lets readers and writers coexist without stepping on each other.',
  '## What MVCC Solves

In a lock-based system, a reader blocks a writer. MVCC eliminates this entirely.

## How It Works

Every row in Postgres has two hidden columns: `xmin` (transaction that created it) and `xmax` (transaction that deleted it). When you update a row, Postgres does not modify it in place. It marks the old row deleted and inserts a new version. Both coexist briefly.

## Snapshots

Every transaction gets a snapshot — a list of which transaction IDs were active when it started. A row is visible only if it was created by a committed transaction before your snapshot, and not deleted by one. Readers see a consistent point-in-time view. Writers create new versions. They never collide.
',
  true,
  now() - interval '9 days',
  11
),
(
  'Rate Limiting at Scale: Token Bucket vs Sliding Window',
  'rate-limiting',
  'Every API needs rate limiting. The algorithm you pick changes your memory usage, accuracy, and burst behaviour at scale.',
  '## Why Rate Limiting Is Hard

The naive approach — count requests in a fixed window — has a thundering herd problem. 100 requests allowed per minute means someone can fire 100 at 00:59 and 100 at 01:01, getting 200 requests in 2 seconds.

## Token Bucket

A bucket holds N tokens. Each request consumes one token. Tokens refill at a fixed rate. Burst traffic is absorbed up to bucket capacity, then throttled.

```typescript
class TokenBucket {
  private tokens: number
  private lastRefill: number
  
  constructor(private capacity: number, private refillRate: number) {
    this.tokens = capacity
    this.lastRefill = Date.now()
  }
  
  consume(): boolean {
    this.refill()
    if (this.tokens < 1) return false
    this.tokens -= 1
    return true
  }
  
  private refill() {
    const now = Date.now()
    const elapsed = (now - this.lastRefill) / 1000
    this.tokens = Math.min(this.capacity, this.tokens + elapsed * this.refillRate)
    this.lastRefill = now
  }
}
```

## Sliding Window

Tracks exact timestamps of recent requests. Accurate but memory-heavy at scale — each user needs a sorted set of timestamps.

## What Real Systems Use

Redis uses token bucket for its own rate limiting. Nginx uses leaky bucket. Stripe uses a sliding window log for billing API limits.
',
  true,
  now() - interval '23 days',
  8
);

-- Link articles to tags (run after both inserts above)
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'consistent-hashing' AND t.slug = 'system-design';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'postgres-mvcc' AND t.slug = 'database-internals';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'rate-limiting' AND t.slug = 'backend';
