import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ArticleListClient from "@/components/ArticleListClient";
import { createClient } from "@/lib/supabase";
import { format } from "date-fns";

export const revalidate = 60;

/* ── Page ───────────────────────────────────────────────────── */

export default async function ArticlesPage() {
  const supabase = createClient();

  const { data: articles, error } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, excerpt, reading_time_minutes, published_at,
      article_tags ( tags ( name, slug ) )
    `
    )
    .eq("published", true)
    .order("published_at", { ascending: false });

  if (error || !articles) {
    return (
      <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-6 py-20">
          <p className="font-body text-sm text-text-muted text-center">
            No articles yet.
          </p>
        </div>
        <Footer />
      </>
    );
  }

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const mapped = articles.map((a: any) => ({
    title: a.title as string,
    tag:
      (a.article_tags?.[0]?.tags?.name as string) ?? "Engineering",
    excerpt: (a.excerpt as string) ?? "",
    readTime: a.reading_time_minutes as number,
    date: a.published_at
      ? format(new Date(a.published_at), "MMM d, yyyy")
      : "Draft",
    slug: a.slug as string,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

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
          {mapped.length} article{mapped.length !== 1 ? "s" : ""}
        </p>
      </header>

      {/* Client component: tag filter + grid */}
      <ArticleListClient articles={mapped} />

      <Footer />
    </>
  );
}
