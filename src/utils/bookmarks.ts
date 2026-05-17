import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

export interface BookmarkMetadata {
  url: string;
  title: string;
  displayUrl: string;
  fetchedAt: string;
  description?: string;
  image?: string;
  siteName?: string;
  favicon?: string;
  status?: "ok" | "fallback";
  error?: string;
}

type BookmarkCache = Record<string, BookmarkMetadata>;

const CACHE_PATH = resolve(process.cwd(), "src/data/bookmark-cache.json");
const BOOKMARK_PREFIX = "!bookmark(";
const BOOKMARK_SUFFIX = ")";
const REQUEST_TIMEOUT_MS = 7000;
const MAX_HTML_BYTES = 750_000;

let cache: BookmarkCache | null = null;
const pendingFetches = new Map<string, Promise<BookmarkMetadata>>();

export function parseBookmarkShortcode(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed.startsWith(BOOKMARK_PREFIX) || !trimmed.endsWith(BOOKMARK_SUFFIX)) {
    return null;
  }

  const rawUrl = trimmed.slice(BOOKMARK_PREFIX.length, -BOOKMARK_SUFFIX.length).trim();
  return normalizeBookmarkUrl(rawUrl);
}

export async function getBookmarkMetadata(rawUrl: string): Promise<BookmarkMetadata | null> {
  const url = normalizeBookmarkUrl(rawUrl);
  if (!url) return null;

  const loadedCache = readCache();
  const cached = loadedCache[url];
  if (cached) return cached;

  const pending = pendingFetches.get(url);
  if (pending) return pending;

  const request = fetchAndCacheBookmark(url).finally(() => {
    pendingFetches.delete(url);
  });
  pendingFetches.set(url, request);
  return request;
}

export function getCachedBookmarkMetadata(rawUrl: string): BookmarkMetadata | null {
  const url = normalizeBookmarkUrl(rawUrl);
  if (!url) return null;

  return readCache()[url] ?? null;
}

export function createFallbackBookmarkMetadata(rawUrl: string): BookmarkMetadata | null {
  const url = normalizeBookmarkUrl(rawUrl);
  if (!url) return null;

  return {
    url,
    title: hostFromUrl(url),
    displayUrl: displayUrlFromUrl(url),
    fetchedAt: new Date().toISOString(),
    status: "fallback",
  };
}

export async function renderBookmarkShortcodesForRss(markdown: string): Promise<string> {
  const lines = markdown.split(/\r?\n/);

  const renderedLines = await Promise.all(
    lines.map(async (line) => {
      const url = parseBookmarkShortcode(line);
      if (!url) return line;

      const metadata = await getBookmarkMetadata(url);
      const label = metadata?.title || metadata?.displayUrl || hostFromUrl(url);
      return `[${escapeMarkdownLinkText(label)}](${url})`;
    }),
  );

  return renderedLines.join("\n");
}

export function collectBookmarkUrlsFromMarkdown(markdown: string): string[] {
  const urls = new Set<string>();

  for (const line of markdown.split(/\r?\n/)) {
    const url = parseBookmarkShortcode(line);
    if (url) urls.add(url);
  }

  return [...urls];
}

export function normalizeBookmarkUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.href;
  } catch {
    return null;
  }
}

export function hostFromUrl(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.replace(/^www\./, "");
  } catch {
    return rawUrl;
  }
}

export function displayUrlFromUrl(rawUrl: string): string {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname === "/" ? "" : url.pathname.replace(/\/$/, "");
    return `${host}${path}`;
  } catch {
    return rawUrl;
  }
}

async function fetchAndCacheBookmark(url: string): Promise<BookmarkMetadata> {
  const metadata = await fetchBookmarkMetadata(url);
  const loadedCache = readCache();
  loadedCache[url] = metadata;
  writeCache(loadedCache);
  return metadata;
}

async function fetchBookmarkMetadata(url: string): Promise<BookmarkMetadata> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(url, {
        headers: {
          accept: "text/html,application/xhtml+xml",
          "user-agent": "dantesito.com bookmark metadata fetcher",
        },
        redirect: "follow",
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const html = await readResponseSnippet(response);
      const baseUrl = response.url || url;
      const extracted = extractBookmarkMetadata(html, baseUrl);
      const title = extracted.title || hostFromUrl(url);

      return {
        url,
        title,
        displayUrl: displayUrlFromUrl(extracted.canonicalUrl || baseUrl || url),
        fetchedAt: new Date().toISOString(),
        description: extracted.description,
        image: extracted.image,
        siteName: extracted.siteName,
        favicon: extracted.favicon,
        status: "ok",
      };
    } finally {
      clearTimeout(timeout);
    }
  } catch (error) {
    return {
      url,
      title: hostFromUrl(url),
      displayUrl: displayUrlFromUrl(url),
      fetchedAt: new Date().toISOString(),
      status: "fallback",
      error: error instanceof Error ? error.message : "Unable to fetch metadata",
    };
  }
}

async function readResponseSnippet(response: Response): Promise<string> {
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let receivedBytes = 0;

  while (receivedBytes < MAX_HTML_BYTES) {
    const { done, value } = await reader.read();
    if (done || !value) break;
    chunks.push(value);
    receivedBytes += value.byteLength;
  }

  await reader.cancel().catch(() => undefined);
  const htmlBytes = concatChunks(chunks, Math.min(receivedBytes, MAX_HTML_BYTES));
  return new TextDecoder().decode(htmlBytes);
}

function concatChunks(chunks: Uint8Array[], totalBytes: number): Uint8Array {
  const combined = new Uint8Array(totalBytes);
  let offset = 0;

  for (const chunk of chunks) {
    const remainingBytes = totalBytes - offset;
    if (remainingBytes <= 0) break;
    const slice = chunk.byteLength > remainingBytes ? chunk.slice(0, remainingBytes) : chunk;
    combined.set(slice, offset);
    offset += slice.byteLength;
  }

  return combined;
}

function extractBookmarkMetadata(html: string, baseUrl: string) {
  const title =
    getMetaContent(html, ["og:title", "twitter:title"]) || getTitleContent(html);
  const description = getMetaContent(html, [
    "og:description",
    "twitter:description",
    "description",
  ]);
  const image = absolutizeHttpUrl(
    getMetaContent(html, [
      "og:image:secure_url",
      "og:image",
      "twitter:image",
      "twitter:image:src",
    ]),
    baseUrl,
  );
  const siteName = getMetaContent(html, ["og:site_name", "application-name"]);
  const favicon = absolutizeHttpUrl(
    getLinkHref(html, ["icon", "shortcut icon", "apple-touch-icon"]),
    baseUrl,
  );
  const canonicalUrl = absolutizeHttpUrl(getLinkHref(html, ["canonical"]), baseUrl);

  return {
    title,
    description,
    image,
    siteName,
    favicon,
    canonicalUrl,
  };
}

function getMetaContent(html: string, names: string[]): string | undefined {
  const wanted = new Set(names.map((name) => name.toLowerCase()));
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const attrs = parseAttributes(tag);
    const key = (attrs.property || attrs.name || attrs.itemprop || "").toLowerCase();
    if (!wanted.has(key)) continue;

    const content = normalizeText(attrs.content ?? "");
    if (content) return content;
  }

  return undefined;
}

function getLinkHref(html: string, rels: string[]): string | undefined {
  const wanted = rels.map((rel) => rel.toLowerCase());
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];

  for (const tag of tags) {
    const attrs = parseAttributes(tag);
    const rel = (attrs.rel || "").toLowerCase();
    const relTokens = new Set(rel.split(/\s+/).filter(Boolean));
    const hasRel = wanted.some((item) => {
      const tokens = item.split(/\s+/);
      return tokens.every((token) => relTokens.has(token));
    });

    if (!hasRel) continue;

    const href = normalizeText(attrs.href ?? "");
    if (href) return href;
  }

  return undefined;
}

function getTitleContent(html: string): string | undefined {
  const match = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  return normalizeText(stripTags(match?.[1] ?? ""));
}

function parseAttributes(tag: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const attrPattern = /([^\s=/>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/g;
  let match: RegExpExecArray | null = null;

  while ((match = attrPattern.exec(tag))) {
    attrs[match[1].toLowerCase()] = decodeHtmlEntities(match[2] ?? match[3] ?? match[4] ?? "");
  }

  return attrs;
}

function normalizeText(value: string): string | undefined {
  const normalized = decodeHtmlEntities(value).replace(/\s+/g, " ").trim();
  return normalized || undefined;
}

function stripTags(value: string): string {
  return value.replace(/<[^>]*>/g, "");
}

function absolutizeHttpUrl(value: string | undefined, baseUrl: string): string | undefined {
  if (!value) return undefined;

  try {
    const url = new URL(value, baseUrl);
    if (url.protocol !== "http:" && url.protocol !== "https:") return undefined;
    return url.href;
  } catch {
    return undefined;
  }
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) => String.fromCodePoint(Number.parseInt(code, 16)));
}

function escapeMarkdownLinkText(value: string): string {
  return value.replace(/([\\[\]])/g, "\\$1").replace(/\n/g, " ");
}

function readCache(): BookmarkCache {
  if (cache) return cache;

  try {
    if (!existsSync(CACHE_PATH)) {
      cache = {};
      return cache;
    }

    const raw = readFileSync(CACHE_PATH, "utf8");
    cache = JSON.parse(raw) as BookmarkCache;
    return cache;
  } catch {
    cache = {};
    return cache;
  }
}

function writeCache(nextCache: BookmarkCache): void {
  cache = nextCache;
  const sortedCache = Object.fromEntries(
    Object.entries(nextCache).sort(([left], [right]) => left.localeCompare(right)),
  );

  mkdirSync(dirname(CACHE_PATH), { recursive: true });
  writeFileSync(CACHE_PATH, `${JSON.stringify(sortedCache, null, 2)}\n`, "utf8");
}
