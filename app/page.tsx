import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import AboutStrip from "@/components/AboutStrip";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";

/* ── Mock Data ──────────────────────────────────────────────── */

const FEATURED_ARTICLE = {
  title:
    "How Consistent Hashing Distributes Load Without Reshuffling Everything",
  tag: "System Design",
  excerpt:
    "Most engineers know consistent hashing exists. Few know exactly why it was invented, what problem it solves at 3am when a node dies, and how DynamoDB and Cassandra actually implement it.",
  readTime: 9,
  date: "May 28, 2026",
  slug: "consistent-hashing",
};

const RECENT_ARTICLES = [
  {
    title: "Why PostgreSQL Uses MVCC Instead of Locking",
    tag: "Database Internals",
    excerpt:
      "Locks block. MVCC lets readers and writers coexist without stepping on each other. Here is exactly how Postgres implements it under the hood.",
    readTime: 11,
    date: "May 21, 2026",
    slug: "postgres-mvcc",
  },
  {
    title: "The Skip List: Probabilistic but Faster Than You Think",
    tag: "DSA",
    excerpt:
      "Redis uses a skip list for its sorted sets. Here is why a probabilistic data structure beats a balanced BST in practice.",
    readTime: 7,
    date: "May 14, 2026",
    slug: "skip-lists",
  },
  {
    title: "Rate Limiting at Scale: Token Bucket vs Sliding Window",
    tag: "Backend",
    excerpt:
      "Every API needs rate limiting. The algorithm you pick changes your memory usage, accuracy, and burst behaviour at scale.",
    readTime: 8,
    date: "May 7, 2026",
    slug: "rate-limiting",
  },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />

      {/* Featured Article */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <p className="font-ui text-xs tracking-[0.2em] uppercase text-accent mb-8">
          This Week
        </p>
        <ArticleCard featured={true} {...FEATURED_ARTICLE} />
      </section>

      {/* Recent Deep-Dives */}
      <section className="max-w-5xl mx-auto px-6 pb-20">
        <p className="font-ui text-xs tracking-[0.2em] uppercase text-accent mb-8">
          Recent Deep-Dives
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECENT_ARTICLES.map((a) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>
      </section>

      <AboutStrip />
      <NewsletterCTA />
      <Footer />
    </>
  );
}
