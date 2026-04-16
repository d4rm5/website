/**
 * Generated mirrors following modern AI standards:
 * - /agents.md: Rich profile for AI agents (via renderAgentsMd())
 * - /llms.txt: Entry point following https://llmstxt.org/ specification
 *
 * Raw blog Markdown is served at /blog/:slug.md via src/pages/blog/[slug].md.ts.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderAgentsMd, renderLlmsTxt } from "../src/data/profile";

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

function writeLlmsTxt(root: string) {
  const raw = process.env.SITE_URL || process.env.PUBLIC_SITE_URL || "";
  const siteUrl = raw.replace(/\/$/, "");
  mkdirSync(join(root, "public"), { recursive: true });
  writeFileSync(
    join(root, "public/llms.txt"),
    renderLlmsTxt(siteUrl),
    "utf8",
  );
}

export function publicMirrorsPlugin(root: string) {
  const sync = () => {
    writeAgentsMd(root);
    writeLlmsTxt(root);
  };
  return {
    name: "public-mirrors",
    buildStart: sync,
    configureServer() {
      sync();
    },
  };
}
