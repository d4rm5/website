import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { marked } from "marked";
import { siteDescription } from "../data/profile";
import { normalizeXPostUrl } from "../utils/x-posts";

const rssRenderer = new marked.Renderer();
const defaultImageRenderer = rssRenderer.image.bind(rssRenderer);

rssRenderer.image = (token: any) => {
  const postUrl = normalizeXPostUrl(String(token.href ?? ""));
  if (!postUrl) return defaultImageRenderer(token);

  const label = String(token.text ?? "").trim() || "View post on X";
  return `<a href="${escapeHtml(postUrl)}">${escapeHtml(label)}</a>`;
};

// Simple, robust RSS generator with strong de-duplication guarantees.
export const GET: APIRoute = async (context) => {
  // Load blog posts and weeknotes into one chronological feed.
  const blogPosts = (await getCollection("blog")).map((entry) => ({
    collection: "blog" as const,
    entry,
  })).filter(({ entry }) => !entry.data.draft);
  const weeknotes = (await getCollection("weeknotes")).map((entry) => ({
    collection: "weeknotes" as const,
    entry,
  })).filter(({ entry }) => !entry.data.draft);

  const entriesAll = [...blogPosts, ...weeknotes].sort((a, b) => {
    const aDate = dateFromEntry(a.entry);
    const bDate = dateFromEntry(b.entry);
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

  const slugFromEntry = (entry: any) => {
    const rawSlug = entry.slug ?? entry.id ?? "";
    const slug = rawSlug.toString().split("/").pop()?.replace(/\.[^/.]+$/, "");
    return slug || slugFromTitle(entry.data?.title);
  };

  // Build a deduplicated list by collection and stable post/weeknote identity.
  const seenKeys = new Set<string>();
  const deduped = entriesAll.filter(({ collection, entry }) => {
    const key = `${collection}:${entry.data?.legacyId ?? slugFromEntry(entry)}`;
    if (seenKeys.has(key)) return false;
    seenKeys.add(key);
    return true;
  });

  // Build items
  const items = deduped.map(({ collection, entry }, idx) => {
    const body = ("body" in entry) ? (entry.body as string) : "";
    const content = body ? marked.parse(body, { renderer: rssRenderer }) : "";
    const basePath = collection === "weeknotes" ? "/weeknotes" : "/blog";
    const rawSlug = slugFromEntry(entry);
    const slug = rawSlug && rawSlug !== "undefined" && rawSlug !== "untitled" ? rawSlug : `post-${idx}`;
    const link = siteBase
      ? new URL(`${basePath}/${slug}/`, siteBase).toString()
      : `${basePath}/${slug}/`;
    const pubDate = dateFromEntry(entry);
    return {
      link,
      title: entry.data.title,
      pubDate,
      description: entry.data.description,
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

function dateFromEntry(entry: any): Date {
  return entry.data.pubDate instanceof Date ? entry.data.pubDate : new Date(entry.data.pubDate as any);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
