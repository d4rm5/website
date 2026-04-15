import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { publicMirrorsPlugin } from "./integrations/public-mirrors";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

export default defineConfig({
  site: process.env.SITE_URL || "https://dantesito.com",
  integrations: [tailwind()],
  vite: {
    plugins: [publicMirrorsPlugin(root)],
  },
});
