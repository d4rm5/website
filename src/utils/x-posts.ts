export function normalizeXPostUrl(rawUrl: string): string | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^mobile\./, "");
    if (host !== "x.com" && host !== "twitter.com") return null;

    const parts = url.pathname.split("/").filter(Boolean);
    const statusIndex = parts.findIndex((part) => part === "status" || part === "statuses");
    const id = statusIndex >= 0 ? parts[statusIndex + 1] : undefined;
    if (!id || !/^\d+$/.test(id)) return null;

    const username = parts[0];
    if (statusIndex === 1 && /^[A-Za-z0-9_]{1,20}$/.test(username)) {
      return `https://x.com/${username}/status/${id}`;
    }

    if (parts[0] === "i" && parts[1] === "web" && statusIndex === 2) {
      return `https://x.com/i/web/status/${id}`;
    }

    return null;
  } catch {
    return null;
  }
}

export function getXPostId(rawUrl: string): string | null {
  const postUrl = normalizeXPostUrl(rawUrl);
  if (!postUrl) return null;

  const match = postUrl.match(/\/status\/(\d+)$/);
  return match?.[1] ?? null;
}
