import tailwind from "@astrojs/tailwind";
import { defineConfig } from "astro/config";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { bookmarkMetadataCacheIntegration } from "./integrations/bookmark-metadata-cache";
import { publicMirrorsPlugin } from "./integrations/public-mirrors";
import { rehypeBookmarkCards } from "./integrations/rehype-bookmark-cards";
import { rehypeImageFigures } from "./integrations/rehype-image-figures";
import { rehypeXPostEmbeds } from "./integrations/rehype-x-post-embeds";
import { rehypeYouTubeEmbeds } from "./integrations/rehype-youtube-embeds";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname);

export default defineConfig({
  site: process.env.SITE_URL || "https://dantesito.com",
  integrations: [bookmarkMetadataCacheIntegration(root), tailwind()],
  markdown: {
    rehypePlugins: [rehypeBookmarkCards, rehypeXPostEmbeds, rehypeYouTubeEmbeds, rehypeImageFigures],
  },
  vite: {
    plugins: [publicMirrorsPlugin(root)],
  },
});
