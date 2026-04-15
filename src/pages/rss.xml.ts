import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { marked } from "marked";
import { siteDescription, siteTitle } from "../data/profile";

export const GET: APIRoute = async (context) => {
  const posts = (await getCollection("blog")).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  return rss({
    title: siteTitle,
    description: siteDescription,
    site: context.site!,
    items: await Promise.all(
      posts.map(async (post) => {
        const body = "body" in post ? (post.body as string) : "";
        const content = body
          ? (marked.parse(body, { async: false }) as string)
          : "";
        return {
          link: `/blog/${post.slug}/`,
          title: post.data.title,
          pubDate: post.data.pubDate,
          description: post.data.description,
          content,
        };
      }),
    ),
  });
};
