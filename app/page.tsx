import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ArticleCard from "@/components/ArticleCard";
import AboutStrip from "@/components/AboutStrip";
import NewsletterCTA from "@/components/NewsletterCTA";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase";
import { format } from "date-fns";

export const revalidate = 60;

/* ── Page ───────────────────────────────────────────────────── */

export default async function Home() {
  const supabase = createClient();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data: articles } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, excerpt, reading_time_minutes, published_at,
      article_tags ( tags ( name, slug ) )
    `
    )
    .eq("published", true)
    .order("published_at", { ascending: false })
    .limit(4);

  const mapped = (articles ?? []).map((a: any) => ({
    title: a.title as string,
    tag: (a.article_tags?.[0]?.tags?.name as string) ?? "Engineering",
    excerpt: (a.excerpt as string) ?? "",
    readTime: a.reading_time_minutes as number,
    date: a.published_at
      ? format(new Date(a.published_at), "MMM d, yyyy")
      : "Draft",
    slug: a.slug as string,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const featured = mapped[0] ?? null;
  const recent = mapped.slice(1);

  return (
    <>
      <Navbar />
      <Hero />

      {/* Featured Article */}
      {featured && (
        <section className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-accent mb-8">
            This Week
          </p>
          <ArticleCard featured={true} {...featured} />
        </section>
      )}

      {/* Recent Deep-Dives */}
      {recent.length > 0 && (
        <section className="max-w-5xl mx-auto px-6 pb-20">
          <p className="font-ui text-xs tracking-[0.2em] uppercase text-accent mb-8">
            Recent Deep-Dives
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recent.map((a) => (
              <ArticleCard key={a.slug} {...a} />
            ))}
          </div>
        </section>
      )}

      <AboutStrip />
      <NewsletterCTA />
      <Footer />
    </>
  );
}
