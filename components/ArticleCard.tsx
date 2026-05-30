import Link from "next/link";

interface ArticleCardProps {
  title: string;
  tag: string;
  excerpt: string;
  readTime: number;
  date: string;
  slug: string;
  featured?: boolean;
}

export default function ArticleCard({
  title,
  tag,
  excerpt,
  readTime,
  date,
  slug,
  featured = false,
}: ArticleCardProps) {
  if (featured) {
    return (
      <Link
        href={`/articles/${slug}`}
        className="block bg-surface border border-border p-8 md:p-12 hover:border-accent transition-colors duration-200 group hover:no-underline"
      >
        {/* Tag */}
        <span className="font-ui text-xs uppercase tracking-widest text-accent bg-transparent border border-accent px-2 py-0.5 inline-block mb-4">
          {tag}
        </span>

        {/* Title */}
        <h2 className="font-display text-3xl md:text-4xl text-text-primary leading-snug mb-4">
          {title}
        </h2>

        {/* Excerpt */}
        <p className="font-body text-sm text-text-secondary leading-relaxed mb-6 line-clamp-2">
          {excerpt}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <span className="font-ui text-xs text-text-muted">
            {readTime} min read · {date}
          </span>
          <span className="font-ui text-sm text-accent group-hover:underline">
            Read article →
          </span>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/articles/${slug}`}
      className="block bg-surface border border-border p-6 hover:border-accent transition-colors duration-200 group hover:no-underline"
    >
      {/* Tag */}
      <span className="font-ui text-[0.65rem] uppercase tracking-widest text-accent bg-transparent border border-accent/40 px-2 py-0.5 inline-block mb-3">
        {tag}
      </span>

      {/* Title */}
      <h3 className="font-display text-xl text-text-primary leading-snug mb-3">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="font-body text-xs text-text-secondary leading-relaxed mb-4 line-clamp-2">
        {excerpt}
      </p>

      {/* Footer */}
      <span className="font-ui text-xs text-text-muted">
        {readTime} min read · {date}
      </span>
    </Link>
  );
}
