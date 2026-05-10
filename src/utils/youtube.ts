const YOUTUBE_VIDEO_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;

export function normalizeYouTubeUrl(rawUrl: string): string | null {
  const video = getYouTubeVideo(rawUrl);
  if (!video) return null;

  const url = new URL("https://www.youtube.com/watch");
  url.searchParams.set("v", video.id);
  if (video.startSeconds > 0) url.searchParams.set("t", `${video.startSeconds}s`);
  return url.toString();
}

export function getYouTubeEmbedUrl(rawUrl: string): string | null {
  const video = getYouTubeVideo(rawUrl);
  if (!video) return null;

  const url = new URL(`https://www.youtube-nocookie.com/embed/${video.id}`);
  if (video.startSeconds > 0) url.searchParams.set("start", String(video.startSeconds));
  return url.toString();
}

function getYouTubeVideo(rawUrl: string): { id: string; startSeconds: number } | null {
  try {
    const url = new URL(rawUrl);
    const host = url.hostname.toLowerCase().replace(/^www\./, "").replace(/^m\./, "");
    const parts = url.pathname.split("/").filter(Boolean);

    let id: string | null = null;

    if (host === "youtu.be") {
      id = parts[0] ?? null;
    } else if (host === "youtube.com" || host === "youtube-nocookie.com") {
      if (parts[0] === "watch") {
        id = url.searchParams.get("v");
      } else if (parts[0] === "embed" || parts[0] === "shorts" || parts[0] === "live") {
        id = parts[1] ?? null;
      }
    }

    if (!id || !YOUTUBE_VIDEO_ID_PATTERN.test(id)) return null;

    return {
      id,
      startSeconds: getStartSeconds(url),
    };
  } catch {
    return null;
  }
}

function getStartSeconds(url: URL): number {
  const start = parseTimestamp(url.searchParams.get("start"));
  if (start > 0) return start;

  return parseTimestamp(url.searchParams.get("t"));
}

function parseTimestamp(value: string | null): number {
  if (!value) return 0;

  if (/^\d+$/.test(value)) return Number(value);
  if (/^\d+s$/.test(value)) return Number(value.slice(0, -1));

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);
  if (!match) return 0;

  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2] ?? 0);
  const seconds = Number(match[3] ?? 0);
  return hours * 3600 + minutes * 60 + seconds;
}
