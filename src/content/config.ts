import { defineCollection, z } from "astro:content";

const blog = defineCollection({
  type: "content",
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
