import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { marked } from "marked";
import { siteDescription } from "../data/profile";

// Simple, robust RSS generator with strong de-duplication guarantees.
export const GET: APIRoute = async (context) => {
  // Load all blog posts and sort by publication date (newest first).
  const postsAll = (await getCollection("blog")).sort((a, b) => {
    const aDate = a.data.pubDate instanceof Date ? a.data.pubDate : new Date(a.data.pubDate as any);
    const bDate = b.data.pubDate instanceof Date ? b.data.pubDate : new Date(b.data.pubDate as any);
    return bDate.valueOf() - aDate.valueOf();
  });

  const siteBase = context.site?.toString() ?? "";

  // Helper: sanitize title into a slug-ish string
  const slugFromTitle = (title?: string) => {
    if (!title) return "untitled";
    const t = title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
    const s = t.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    return s || "untitled";
  };

  // Build a deduplicated list of posts by legacyId first, then by slug-derived key
  const seenKeys = new Set<string>();
  const deduped = postsAll.filter((p) => {
    const key = p.legacyId ?? slugFromTitle(p.data?.title);
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  // Build items
  const items = deduped.map((post, idx) => {
    const body = ("body" in post) ? (post.body as string) : "";
    const content = body ? marked.parse(body) : "";
    // Safe slug for URL
    const rawSlug = post.slug ?? slugFromTitle(post.data?.title);
    const slug = rawSlug && rawSlug !== "undefined" && rawSlug !== "untitled" ? rawSlug : `post-${idx}`;
    const link = siteBase
      ? new URL(`/blog/${slug}/`, siteBase).toString()
      : `/blog/${slug}/`;
    const pubDate = post.data.pubDate instanceof Date ? post.data.pubDate : new Date(post.data.pubDate as any);
    return {
      link,
      title: post.data.title,
      pubDate,
      description: post.data.description,
      content,
      guid: `${link}-${pubDate.toISOString()}`,
    };
  });

  return rss({
    title: "Dante's Delirium",
    description: siteDescription,
    site: context.site!,
    items,
  });
};
