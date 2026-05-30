-- Seed: 3 sample articles with full markdown content

INSERT INTO articles (title, slug, excerpt, content, published, published_at, reading_time_minutes) VALUES
(
  'How Consistent Hashing Distributes Load Without Reshuffling Everything',
  'consistent-hashing',
  'Most engineers know consistent hashing exists. Few know exactly why it was invented, what problem it solves at 3am when a node dies.',
  E'## The Problem With Naive Hashing\n\nWhen you have 4 servers and need to distribute keys, the obvious approach is:\n\n```\nserver = hash(key) % number_of_servers\n```\n\nThis works perfectly — until you add or remove a server. When `number_of_servers` changes from 4 to 5, almost every key maps to a different server. In a cache, that means a near-total cache miss storm.\n\n## The Ring\n\nConsistent hashing solves this by mapping both servers and keys onto a circular ring of hash values (typically 0 to 2³²-1).\n\n```\nRing positions (0 to 2^32):\n\n  ServerA → hash("ServerA") = 12%\n  ServerB → hash("ServerB") = 37%\n  ServerC → hash("ServerC") = 63%\n  ServerD → hash("ServerD") = 89%\n```\n\nTo find which server owns a key, you hash the key and walk clockwise until you hit a server.\n\n## What Happens When a Server Dies\n\nOnly the keys that were owned by the dead server need to move — they go to the next server clockwise. Every other key stays exactly where it is.\n\nThis is the core insight: **O(K/N) keys move** instead of O(K) keys.\n\n## Virtual Nodes\n\nReal implementations don''t place each server at one position. They place each server at hundreds of positions (virtual nodes). This ensures even distribution even when servers have different capacities.\n\n```typescript\nfunction addServer(serverName: string, vnodes: number = 150) {\n  for (let i = 0; i < vnodes; i++) {\n    const position = hash(`${serverName}#${i}`)\n    ring.set(position, serverName)\n  }\n}\n```\n\n## Where It''s Used\n\n- **DynamoDB** — consistent hashing across storage nodes\n- **Cassandra** — token ring is consistent hashing\n- **Nginx** — consistent hashing upstream module for load balancing\n- **CDN routing** — route requests to nearest/least-loaded edge node\n\nThe next time a node disappears at 3am and your cache doesn''t explode, thank consistent hashing.',
  true,
  '2026-05-28T00:00:00Z',
  9
),
(
  'Why PostgreSQL Uses MVCC Instead of Locking',
  'postgres-mvcc',
  'Locks block. MVCC lets readers and writers coexist without stepping on each other. Here is exactly how Postgres implements it under the hood.',
  E'## What MVCC Solves\n\nIn a lock-based system, a reader blocks a writer and a writer blocks a reader. MVCC eliminates this entirely.\n\n## How It Works\n\nEvery row in Postgres has two hidden columns: `xmin` (the transaction that created it) and `xmax` (the transaction that deleted it).\n\n```sql\nSELECT xmin, xmax, * FROM your_table LIMIT 5;\n```\n\nWhen you update a row, Postgres does not modify it in place. It marks the old row as deleted (sets xmax) and inserts a new row version. Both versions coexist on disk briefly.\n\n## Snapshots\n\nEvery transaction gets a snapshot — a list of which transaction IDs were active when it started. A row is visible to your transaction only if it was created by a committed transaction that precedes your snapshot, and not deleted by one.\n\n## The Cost: Bloat\n\nDead row versions pile up. This is why Postgres needs `VACUUM` — a background process that reclaims space from dead tuples.\n\n```sql\n-- Check dead tuple count\nSELECT relname, n_dead_tup, n_live_tup\nFROM pg_stat_user_tables\nORDER BY n_dead_tup DESC;\n```\n\nReaders see a consistent point-in-time view. Writers create new versions. They never collide. The tradeoff is disk bloat and the need for vacuuming.',
  true,
  '2026-05-21T00:00:00Z',
  11
),
(
  'B-Trees: Why Every Database Uses Them',
  'b-trees',
  'Hash maps are faster at point lookups. So why does every major database default to a B-Tree index? The answer is range queries.',
  E'## The Problem With Hash Indexes\n\nA hash index gives O(1) point lookups. But try running `WHERE age BETWEEN 25 AND 35` on a hash index. You can''t — there''s no ordering. You''d have to scan every bucket.\n\n## What a B-Tree Provides\n\nA B-Tree keeps keys sorted. This enables:\n- Point lookups: O(log n)\n- Range queries: O(log n + k) where k is the result count\n- Prefix matching, ORDER BY, MIN/MAX — all efficient\n\n## The Structure\n\nA B-Tree of order M means each node holds up to M-1 keys and M children. Nodes are designed to match disk page sizes (typically 4KB or 8KB).\n\n```\n          [17 | 35]              ← root\n         /    |    \\\n   [5|11]  [23|29]  [42|48|56]   ← internal nodes\n   / | \\    / | \\    / | | \\\n  ← leaf nodes with actual data →\n```\n\n## Why Disk Layout Matters\n\nEach node read is a disk I/O. A B-Tree with branching factor 500 can index 125 million keys in just 3 levels — meaning 3 disk reads for any lookup.\n\n```python\nimport math\n\nbranching_factor = 500\nkeys = 125_000_000\nlevels = math.ceil(math.log(keys, branching_factor))\nprint(f"Levels: {levels}")  # 3\nprint(f"Disk reads per lookup: {levels}")  # 3\n```\n\n## B+ Tree Variant\n\nMost databases (Postgres, MySQL InnoDB) actually use B+ Trees, where all data lives in leaf nodes and leaf nodes are linked together. This makes range scans a simple linked-list traversal.\n\n## The Tradeoff\n\nWrites are more expensive than a hash index because the tree must be rebalanced. But for mixed read-write workloads with range queries, nothing beats a B-Tree.',
  true,
  '2026-04-23T00:00:00Z',
  12
);

-- Link articles to tags
INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'consistent-hashing' AND t.slug = 'system-design';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'postgres-mvcc' AND t.slug = 'database-internals';

INSERT INTO article_tags (article_id, tag_id)
SELECT a.id, t.id FROM articles a, tags t
WHERE a.slug = 'b-trees' AND t.slug = 'database-internals';
