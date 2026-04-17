import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const getStaticPaths = (async () => {
  const posts = await getCollection("blog");
  const slugFromPost = (p: any) => p.slug ?? (p.id ?? '').toString().split('/').pop()?.replace(/\.[^/.]+$/, '');
  const valid = posts.filter((p: any) => !!slugFromPost(p));
  return valid.map((post: any) => ({ params: { slug: slugFromPost(post) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response(null, { status: 404 });

  const posts = await getCollection("blog");
  const slugFromPost = (p: any) => p.slug ?? (p.id ?? '').toString().split('/').pop()?.replace(/\.[^/.]+$/, '');
  if (!posts.some((p: any) => slugFromPost(p) === slug)) return new Response(null, { status: 404 });

  // Try .md first, then .mdx
  let filePath = join(process.cwd(), "src/content/blog", `${slug}.md`);
  try {
    const raw = await readFile(filePath, "utf8");
    return new Response(raw, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    // MDX fallback
    filePath = join(process.cwd(), "src/content/blog", `${slug}.mdx`);
    try {
      const raw = await readFile(filePath, "utf8");
      return new Response(raw, {
        status: 200,
        headers: {
          "Content-Type": "text/markdown; charset=utf-8",
          "Cache-Control": "public, max-age=3600",
        },
      });
    } catch {
      return new Response(null, { status: 404 });
    }
  }
};
