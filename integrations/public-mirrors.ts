/**
 * Single source of truth:
 * - Blog posts: src/content/blog/*.md → mirrored to public/blog/ for raw /blog/*.md URLs
 * - Agents profile: src/data/profile.ts → public/agents.md via renderAgentsMd()
 */
import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readdirSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { join } from "node:path";
import { renderAgentsMd } from "../src/data/profile";

function mirrorBlogMd(root: string) {
  const srcDir = join(root, "src/content/blog");
  const outDir = join(root, "public/blog");
  if (!existsSync(srcDir)) return;
  mkdirSync(outDir, { recursive: true });
  const keep = new Set<string>();
  for (const name of readdirSync(srcDir)) {
    if (!name.endsWith(".md")) continue;
    keep.add(name);
    copyFileSync(join(srcDir, name), join(outDir, name));
  }
  for (const name of readdirSync(outDir)) {
    if (!name.endsWith(".md")) continue;
    if (!keep.has(name)) unlinkSync(join(outDir, name));
  }
}

function writeAgentsMd(root: string) {
  const raw = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "";
  const siteUrl = raw.replace(/\/$/, "");
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(
    join(root, "public/agents.md"),
    renderAgentsMd(siteUrl),
    "utf8",
  );
}

export function publicMirrorsPlugin(root: string) {
  const sync = () => {
    mirrorBlogMd(root);
    writeAgentsMd(root);
  };
  return {
    name: "public-mirrors",
    buildStart: sync,
    configureServer() {
      sync();
    },
  };
}
