import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import {
  collectBookmarkUrlsFromMarkdown,
  getBookmarkMetadata,
} from "../src/utils/bookmarks";

const CONTENT_DIRS = ["src/content/blog", "src/content/weeknotes"];
const MARKDOWN_FILE_PATTERN = /\.(md|mdx)$/;

export function bookmarkMetadataCacheIntegration(root: string) {
  const sync = async () => {
    const urls = collectBookmarkUrls(root);
    await Promise.all(urls.map((url) => getBookmarkMetadata(url)));
  };

  return {
    name: "bookmark-metadata-cache",
    hooks: {
      "astro:config:setup": async ({ command }: { command: string }) => {
        if (command !== "preview") await sync();
      },
      "astro:server:setup": ({ server }: { server: any }) => {
        for (const contentDir of CONTENT_DIRS) {
          server.watcher.add(join(root, contentDir));
        }

        server.watcher.on("change", (filePath: string) => {
          if (isContentMarkdownFile(filePath)) {
            sync();
          }
        });
      },
    },
  };
}

function collectBookmarkUrls(root: string): string[] {
  const urls = new Set<string>();

  for (const contentDir of CONTENT_DIRS) {
    const absoluteDir = join(root, contentDir);
    if (!existsSync(absoluteDir)) continue;

    for (const filePath of listMarkdownFiles(absoluteDir)) {
      const markdown = readFileSync(filePath, "utf8");
      for (const url of collectBookmarkUrlsFromMarkdown(markdown)) {
        urls.add(url);
      }
    }
  }

  return [...urls];
}

function listMarkdownFiles(dir: string): string[] {
  const files: string[] = [];

  for (const entry of readdirSync(dir)) {
    const entryPath = join(dir, entry);
    const stats = statSync(entryPath);

    if (stats.isDirectory()) {
      files.push(...listMarkdownFiles(entryPath));
      continue;
    }

    if (stats.isFile() && MARKDOWN_FILE_PATTERN.test(entryPath)) {
      files.push(entryPath);
    }
  }

  return files;
}

function isContentMarkdownFile(filePath: string): boolean {
  return MARKDOWN_FILE_PATTERN.test(filePath) && filePath.includes(`${join("src", "content")}`);
}
