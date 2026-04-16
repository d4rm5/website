/**
 * Generated mirror:
 * - Agents profile: src/data/profile.ts → public/agents.md via renderAgentsMd()
 *
 * Raw blog Markdown is served at /blog/:slug.md via src/pages/blog/[slug].md.ts (no copy under public/).
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { renderAgentsMd } from "../src/data/profile";

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
