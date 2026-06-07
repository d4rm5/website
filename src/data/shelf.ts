export type ShelfKind =
	| "book"
	| "movie"
	| "series"
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
	series: "Series",
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
	"series",
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
		url: "https://www.navalmanack.com/",
		note: "A compact collection of ideas on leverage, judgment, wealth, and happiness.",
		added: "2026-05-09",
	},
	{
		title: "The Book of Elon",
		kind: "book",
		creator: "Eric Jorgenson",
		url: "https://www.elonmuskbook.org/",
		note: "A compact collection of Elon Musk on work, companies and porpuse.",
		added: "2026-06-07",
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
		title: "Akira",
		kind: "movie",
		creator: "Katsuhiro Otomo",
		url: "https://letterboxd.com/film/akira/",
		note: "A landmark cyberpunk anime with explosive worldbuilding and visual force.",
		added: "2026-05-09",
	},
	{
		title: "Marty Supreme",
		kind: "movie",
		creator: "Josh Safdie",
		url: "https://letterboxd.com/film/marty-supreme/",
		note: "A high-strung story about chasing greatness past the point of good sense.",
		added: "2026-05-09",
	},
	{
		title: "Memento",
		kind: "movie",
		creator: "Christopher Nolan",
		url: "https://letterboxd.com/film/memento/",
		note: "A fractured thriller about memory, identity, and self-deception.",
		added: "2026-05-09",
	},
	{
		title: "One Battle After Another",
		kind: "movie",
		creator: "Paul Thomas Anderson",
		url: "https://letterboxd.com/film/one-battle-after-another/",
		note: "A paranoid, kinetic reunion of ex-revolutionaries and unfinished history.",
		added: "2026-05-09",
	},
	{
		title: "Punch-Drunk Love",
		kind: "movie",
		creator: "Paul Thomas Anderson",
		url: "https://letterboxd.com/film/punch-drunk-love/",
		note: "An anxious, luminous romance about loneliness finding an exit.",
		added: "2026-05-09",
	},
	{
		title: "The Truman Show",
		kind: "movie",
		creator: "Peter Weir",
		url: "https://letterboxd.com/film/the-truman-show/",
		note: "A clean, unsettling fable about surveillance, performance, and escape.",
		added: "2026-05-09",
	},
	{
		title: "Better Call Saul",
		kind: "series",
		creator: "Vince Gilligan and Peter Gould",
		url: "https://www.imdb.com/title/tt3032476/",
		note: "A patient legal tragedy about compromise, identity, and consequence.",
		added: "2026-05-09",
	},
	{
		title: "Breaking Bad",
		kind: "series",
		creator: "Vince Gilligan",
		url: "https://www.imdb.com/title/tt0903747/",
		note: "A ruthless transformation story with unusually precise escalation.",
		added: "2026-05-09",
	},
	{
		title: "Mr. Robot",
		kind: "series",
		creator: "Sam Esmail",
		url: "https://www.imdb.com/title/tt4158110/",
		note: "A cyberpsychological thriller about systems, control, and fractured identity.",
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
		title: "On Learning How to Learn",
		kind: "article",
		creator: "Hasu",
		url: "https://substack.com/@hasu/p-154778560",
		note: "A useful essay on improving the way you acquire and compound knowledge.",
		added: "2026-05-09",
	},
	{
		title: "Lifehacks",
		kind: "article",
		creator: "Alexey Guzey",
		url: "https://guzey.com/lifehacks/",
		note: "A practical collection of small habits, tools, and tactics for living better.",
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
