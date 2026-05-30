"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";

interface Article {
  title: string;
  tag: string;
  excerpt: string;
  readTime: number;
  date: string;
  slug: string;
}

const TAGS = [
  "All",
  "System Design",
  "Database Internals",
  "DSA",
  "Backend",
  "Distributed Systems",
  "Architecture",
];

export default function ArticleListClient({
  articles,
}: {
  articles: Article[];
}) {
  const [activeTag, setActiveTag] = useState("All");

  const filtered =
    activeTag === "All"
      ? articles
      : articles.filter((a) => a.tag === activeTag);

  return (
    <>
      {/* Tag Filter Bar */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag)}
              className={`shrink-0 font-ui text-xs px-3 py-1 rounded-none transition-colors cursor-pointer ${
                activeTag === tag
                  ? "bg-accent text-[#0C0C0C] font-semibold border border-accent"
                  : "bg-transparent border border-border text-text-secondary hover:border-accent hover:text-accent"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-5xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} {...a} />
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="font-body text-sm text-text-muted text-center py-16">
            No articles in this category yet.
          </p>
        )}
      </div>
    </>
  );
}
