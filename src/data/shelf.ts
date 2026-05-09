export type ShelfKind =
	| "book"
	| "movie"
	| "album"
	| "podcast"
	| "article"
	| "video"
	| "tool"
	| "other";

export type ShelfItem = {
	title: string;
	kind: ShelfKind;
	note: string;
	creator?: string;
	url?: string;
	added?: string;
	draft?: boolean;
};

export const shelfKindLabels: Record<ShelfKind, string> = {
	book: "Books",
	movie: "Movies",
	album: "Albums",
	podcast: "Podcasts",
	article: "Articles",
	video: "Videos",
	tool: "Tools",
	other: "Other",
};

export const shelfKindOrder: readonly ShelfKind[] = [
	"book",
	"movie",
	"album",
	"podcast",
	"article",
	"video",
	"tool",
	"other",
];

export const shelfItems: readonly ShelfItem[] = [
	{
		title: "The Almanack of Naval Ravikant",
		kind: "book",
		creator: "Eric Jorgenson",
		url: "https://www.goodreads.com/book/show/55148500-the-almanack-of-naval-ravikant",
		note: "A compact collection of ideas on leverage, judgment, wealth, and happiness.",
		added: "2026-05-09",
	},
	{
		title: "The MANIAC",
		kind: "book",
		creator: "Benjamin Labatut",
		url: "https://www.goodreads.com/en/book/show/75665931-the-maniac",
		note: "A feverish literary portrait of computation, genius, and the people around it.",
		added: "2026-05-09",
	},
	{
		title: "Ficciones",
		kind: "book",
		creator: "Jorge Luis Borges",
		url: "https://www.goodreads.com/book/show/426504.Ficciones",
		note: "A foundational maze of stories about infinity, language, authorship, and reality.",
		added: "2026-05-09",
	},
	{
		title: "Why Greatness Cannot Be Planned",
		kind: "book",
		creator: "Kenneth O. Stanley and Joel Lehman",
		url: "https://www.goodreads.com/book/show/25670869-why-greatness-cannot-be-planned",
		note: "A sharp argument against overfitting life and research to fixed objectives.",
		added: "2026-05-09",
	},
	{
		title: "How to Live an Asymmetric Life",
		kind: "video",
		creator: "Graham Weaver",
		url: "https://www.youtube.com/watch?v=dZxbVGhpEkI",
		note: "A useful lecture on choosing paths with asymmetric upside.",
		added: "2026-05-09",
	},
	{
		title: "Tecnología Informal",
		kind: "podcast",
		url: "https://pod.link/1607865895",
		note: "A conversational technology podcast worth keeping close.",
		added: "2026-05-09",
	},
	{
		title: "Elige tu Propia Aventura",
		kind: "podcast",
		url: "https://pod.link/1573602789",
		note: "A podcast about choosing paths, stories, and ideas with curiosity.",
		added: "2026-05-09",
	},
	{
		title: "Nada Respetable",
		kind: "article",
		url: "https://nadarespetable.com",
		note: "Cultural criticism with art and paranoia as tools of resistance",
		added: "2026-05-09",
	},
	{
		title: "421",
		kind: "article",
		url: "https://421.news",
		note: "Curated cognitive diet",
		added: "2026-05-09",
	},
	{
		title: "Círculo Vicioso",
		kind: "podcast",
		url: "https://pod.link/1510688047",
		note: "Society and Culture",
		added: "2026-05-08",
	},
	// {
	// 	title: "Example title",
	// 	kind: "book",
	// 	creator: "Author name",
	// 	url: "https://example.com",
	// 	note: "One sentence about what this gave you.",
	// 	added: "2026-05-09",
	// },
] as const;

export function getPublishedShelfItems(): ShelfItem[] {
	return [...shelfItems]
		.filter((item) => !item.draft)
		.sort((a, b) => {
			const aDate = a.added ? new Date(`${a.added}T12:00:00`).getTime() : 0;
			const bDate = b.added ? new Date(`${b.added}T12:00:00`).getTime() : 0;
			return bDate - aDate || a.title.localeCompare(b.title);
		});
}

export function groupShelfItemsByKind(items = getPublishedShelfItems()) {
	return shelfKindOrder
		.map((kind) => ({
			kind,
			label: shelfKindLabels[kind],
			items: items.filter((item) => item.kind === kind),
		}))
		.filter((group) => group.items.length > 0);
}

export function renderShelfMarkdown(siteUrl = ""): string {
	const base = siteUrl.replace(/\/$/, "");
	const htmlShelf = base ? `${base}/shelf/` : "/shelf/";
	const groups = groupShelfItemsByKind();
	const lines = [
		`[HTML version](${htmlShelf})`,
		"",
		"# Shelf",
		"",
		"Books, movies, albums, podcasts, articles, and other things that gave something to my life.",
		"",
	];

	if (groups.length === 0) {
		lines.push("_Nothing published yet._", "");
		return lines.join("\n");
	}

	for (const group of groups) {
		lines.push(`## ${group.label}`, "");
		for (const item of group.items) {
			const title = item.url ? `[${item.title}](${item.url})` : item.title;
			const creator = item.creator ? ` — ${item.creator}` : "";
			const note = item.note ? `: ${item.note}` : "";
			const added = item.added ? ` (${item.added})` : "";
			lines.push(`- ${title}${creator}${note}${added}`);
		}
		lines.push("");
	}

	return lines.join("\n");
}
