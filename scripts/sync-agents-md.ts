import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderAgentsMd } from "../src/data/profile.ts";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const siteUrl = process.env.SITE_URL ?? process.env.PUBLIC_SITE_URL ?? "";

writeFileSync(join(root, "public/agents.md"), renderAgentsMd(siteUrl), "utf8");
