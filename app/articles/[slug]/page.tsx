import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReadingProgress from "@/components/ReadingProgress";
import ArticleBody from "@/components/ArticleBody";
import NewsletterForm from "@/components/NewsletterForm";
import { createClient } from "@/lib/supabase";
import { format } from "date-fns";

export const revalidate = 300;
export const dynamicParams = true;

/* ── Static Generation ──────────────────────────────────────── */

export async function generateStaticParams(): Promise<{ slug: string }[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("articles")
    .select("slug")
    .eq("published", true);

  return data?.map((a) => ({ slug: a.slug })) ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createClient();
  const { data: article } = await supabase
    .from("articles")
    .select("title, excerpt")
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) return { title: "Article Not Found — Algormn" };

  return {
    title: `${article.title} — Algormn`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt ?? undefined,
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
  const supabase = createClient();

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const { data: article } = await supabase
    .from("articles")
    .select(
      `
      id, title, slug, excerpt, content, reading_time_minutes, published_at,
      article_tags ( tags ( name, slug ) )
    `
    )
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!article) notFound();

  // 3 more articles for sidebar
  const { data: more } = await supabase
    .from("articles")
    .select("title, slug, article_tags ( tags ( name ) )")
    .eq("published", true)
    .neq("slug", slug)
    .order("published_at", { ascending: false })
    .limit(3);

  const tag =
    (article as any).article_tags?.[0]?.tags?.name ?? "Engineering";
  const dateStr = article.published_at
    ? format(new Date(article.published_at), "MMM d, yyyy")
    : "Draft";

  const moreArticles = (more ?? []).map((a: any) => ({
    title: a.title as string,
    slug: a.slug as string,
    tag: a.article_tags?.[0]?.tags?.name ?? "Engineering",
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <>
      <ReadingProgress />
      <Navbar />

      <main className="max-w-5xl mx-auto px-6">
        {/* Article Header */}
        <header className="max-w-2xl pb-12 pt-16">
          <span className="font-ui text-xs uppercase tracking-widest text-accent bg-transparent border border-accent px-2 py-0.5 inline-block">
            {tag}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mt-4 mb-6">
            {article.title}
          </h1>
          <div className="font-ui text-xs text-text-muted flex gap-4 items-center">
            <span>{article.reading_time_minutes} min read</span>
            <span>·</span>
            <span>{dateStr}</span>
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
