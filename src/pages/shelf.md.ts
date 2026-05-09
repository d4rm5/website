import type { APIRoute } from "astro";
import { renderShelfMarkdown } from "../data/shelf";

export const GET: APIRoute = async (context) => {
	const siteUrl = context.site?.toString() ?? "";

	return new Response(renderShelfMarkdown(siteUrl), {
		status: 200,
		headers: {
			"Content-Type": "text/markdown; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
};
