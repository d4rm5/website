import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const getStaticPaths = (async () => {
  const weeknotes = (await getCollection("weeknotes")).filter((weeknote) => !weeknote.data.draft);
  const slugFromWeeknote = (p: any) => p.slug ?? (p.id ?? '').toString().split('/').pop()?.replace(/\.[^/.]+$/, '');
  const valid = weeknotes.filter((p: any) => !!slugFromWeeknote(p));
  return valid.map((weeknote: any) => ({ params: { slug: slugFromWeeknote(weeknote) } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  if (!slug) return new Response(null, { status: 404 });

  const weeknotes = (await getCollection("weeknotes")).filter((weeknote) => !weeknote.data.draft);
  const slugFromWeeknote = (p: any) => p.slug ?? (p.id ?? '').toString().split('/').pop()?.replace(/\.[^/.]+$/, '');
  if (!weeknotes.some((p: any) => slugFromWeeknote(p) === slug)) return new Response(null, { status: 404 });

  // Try .md first, then .mdx
  let filePath = join(process.cwd(), "src/content/weeknotes", `${slug}.md`);
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
    filePath = join(process.cwd(), "src/content/weeknotes", `${slug}.mdx`);
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
