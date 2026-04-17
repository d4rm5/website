import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Content collection loader for blog posts stored under src/content/blog
const blog = defineCollection({
  // Build-time loader that reads Markdown/MDX files from the blog content dir
  loader: glob({
    pattern: "**/*.(md|mdx)",
    base: "./src/content/blog",
    // Generate a stable slug based on the file name (basename) without extension
    generateId: ({ entry }) => {
      const file = entry.split('/').pop() ?? entry;
      return file.replace(/\.[^/.]+$/, '');
    },
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    legacyId: z.string().optional(),
    /** Absolute URL or site path (e.g. /avatar.png) for Open Graph / X previews */
    image: z.string().optional(),
  }),
});

export const collections = { blog };
