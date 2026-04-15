/**
 * Copy blog sources to public so /blog/<slug>.md is served as raw Markdown.
 * Run from predev / prebuild with sync:agents.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const srcDir = path.join(root, "src/content/blog");
const outDir = path.join(root, "public/blog");

fs.mkdirSync(outDir, { recursive: true });
for (const name of fs.readdirSync(srcDir)) {
  if (!name.endsWith(".md")) continue;
  fs.copyFileSync(path.join(srcDir, name), path.join(outDir, name));
}
console.log("Synced src/content/blog → public/blog");
