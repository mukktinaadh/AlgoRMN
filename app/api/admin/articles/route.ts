import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      title,
      slug,
      excerpt,
      content,
      tags,
      published,
      reading_time_minutes,
    } = body as {
      title: string;
      slug: string;
      excerpt: string;
      content: string;
      tags: string[];
      published: boolean;
      reading_time_minutes: number;
    };

    if (!title || !slug || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title, slug, content" },
        { status: 400 }
      );
    }

    // Insert article
    const { data: article, error: articleError } = await supabaseAdmin
      .from("articles")
      .insert({
        title,
        slug,
        excerpt: excerpt || null,
        content,
        published,
        published_at: published ? new Date().toISOString() : null,
        reading_time_minutes: reading_time_minutes || 1,
      })
      .select("id, slug")
      .single();

    if (articleError) {
      console.error("Article insert error:", articleError);
      return NextResponse.json(
        { error: articleError.message },
        { status: 500 }
      );
    }

    // If tags provided, link them via article_tags
    if (tags && tags.length > 0) {
      // Look up tag IDs by name
      const { data: tagRows } = await supabaseAdmin
        .from("tags")
        .select("id, name")
        .in("name", tags);

      if (tagRows && tagRows.length > 0) {
        const tagLinks = tagRows.map((t) => ({
          article_id: article.id,
          tag_id: t.id,
        }));

        const { error: linkError } = await supabaseAdmin
          .from("article_tags")
          .insert(tagLinks);

        if (linkError) {
          console.error("Tag link error:", linkError);
        }
      }
    }

    return NextResponse.json({ success: true, article });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
