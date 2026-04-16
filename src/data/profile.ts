export const displayName = "dantesito";

export const tagline = "Hacker · Argentina";

/**
 * Dual AI-friendly approach:
 *
 * 1. /llms.txt - Entry point following the llms.txt specification (https://llmstxt.org/)
 *    Provides a curated overview with clear sections and links to richer content.
 *
 * 2. /agents.md - Rich, comprehensive profile with full bio, all projects,
 *    talks & volunteering. This contains the detailed information that LLMs
 *    should actually read.
 *
 * This follows the llms.txt recommendation: have a concise entry point that
 * points to the detailed Markdown content.
 */

/** Browser tab, RSS `<title>`, and other metadata. */
export const siteTitle = "dantesito.com";

/** Short line for `<meta name="description">`, Open Graph, and RSS `<description>`. */
export const siteDescription =
	"Member of The Red Guild, co-founder of HackTandil.";

export const twitterSite = "@d4rm_";

/** X Card: author on blog posts */
export const twitterCreator = "@d4rm_";

export const org = {
	name: "The Red Guild",
	url: "https://theredguild.org",
} as const;

export const hacktandil = {
	name: "HackTandil",
	url: "https://hacktandil.org",
} as const;

export const socials = [
	{ name: "My blog", url: "/blog/" },
	{ name: "Email", url: "mailto:hello@dantesito.com" },
	{ name: "X", url: "https://x.com/d4rm_" },
	{ name: "GitHub", url: "https://github.com/d4rm5" },
	{ name: "Telegram", url: "https://t.me/d4rm5" },
	{ name: "LinkedIn", url: "https://linkedin.com/in/dantemartinez5" },
] as const;

/** Conference / community events where you've spoken, curated, volunteered, or ran on-site awareness (most recent first in the UI). */
export type EventRole = "speaker" | "volunteer" | "curator" | "campaign";

export type ProfileEvent = {
	name: string;
	/** ISO date (YYYY-MM-DD); used for sorting and display */
	date: string;
	location?: string;
	roles: readonly EventRole[];
	/** Short context: series, org, or talk title */
	detail?: string;
	/** Event URL, slides, recording, or a write-up (e.g. /blog/...) */
	url?: string;
};

/** Human-readable labels for the home page (agents.md uses lowercase role names). */
export function formatEventRoleLabel(role: EventRole): string {
	switch (role) {
		case "speaker":
			return "Speaker";
		case "volunteer":
			return "Volunteer";
		case "curator":
			return "Content curator";
		case "campaign":
			return "Awareness campaign";
	}
}

function roleNameForAgentsMd(role: EventRole): string {
	switch (role) {
		case "speaker":
			return "speaker";
		case "volunteer":
			return "volunteer";
		case "curator":
			return "curator";
		case "campaign":
			return "campaign";
	}
}

export const events: readonly ProfileEvent[] = [
	{
		name: "Devconnect Buenos Aires — A.L.E.R.T.",
		date: "2025-11-19",
		location: "Buenos Aires, Argentina",
		roles: ["campaign"],
		detail: "On-site security awareness · The Red Guild",
		url: "https://blog.theredguild.org/against-all-odds-security-awareness-campaign-at-devconnect/",
	},
	{
		name: "Ekoparty",
		date: "2025-10-23",
		location: "Buenos Aires, Argentina",
		roles: ["speaker"],
		detail: "“Quick intro to some of the threats in Web3”",
		url: "https://blog.theredguild.org/our-presence-at-the-biggest-security-latin-american-conference-ekoparty/",
	},
	{
		name: "Ethereum Essentials · Nodo Serrano",
		date: "2025-10-15",
		location: "Buenos Aires, Argentina",
		roles: ["speaker"],
		detail: "“¿Qué es Ethereum?”",
		url: "https://devconnect.org/destino/ethereum-essentials-volume-1-006Vj00000M6G8gIAF",
	},
	{
		name: "Governance Day",
		date: "2024-11-11",
		location: "Bangkok, Thailand",
		roles: ["volunteer"],
		detail: "Side event during Devcon SEA week · SEEDGov",
		url: "/blog/devcon-sea/",
	},
	{
		name: "GEERS Blockchain",
		date: "2024-09-15",
		location: "Argentina",
		roles: ["speaker", "curator"],
		detail: "Speaker & content curation",
		url: "http://geers.in/blockchain",
	},
];

/** Newest first; safe to call at build time. */
export function getProfileEventsChronological(): ProfileEvent[] {
	return [...events].sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

export function formatProfileEventDate(iso: string): string {
	const d = new Date(`${iso}T12:00:00`);
	return d.toLocaleDateString("en", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
}

export const projects = [
	{
		name: "Phishing Dojo",
		url: "https://phishingdojo.com",
		description: "Anti-phishing training product · The Red Guild",
	},
	{
		name: "TRG Threat Dashboard (shut down)",
		url: "https://noc.theredguild.org",
		description:
			"TLS cert stream in real time, crypto lookalike domains scored (similarity + keywords), queued for review & reporting · The Red Guild",
	},
	{
		name: "@theredguild/devcontainer-wizard",
		url: "https://www.npmjs.com/package/@theredguild/devcontainer-wizard",
		description: "CLI for scaffolding web3 Dev Containers · The Red Guild",
	},
	{
		name: "Superswap",
		url: "https://dorahacks.io/buidl/20852",
		description:
			"Hackathon winner, financial innovation track — DeFi cross-chain swaps",
	},
	{
		name: "Libly (shut down)",
		url: "https://substack.com/home/post/p-141759272",
		description:
			"Startup idea: second-hand book marketplace · Next.js, Node.js",
	},
	{
		name: "High school library digital credential",
		url: "https://x.com/d4rm_/status/1722034025190023404",
		description: "School final project · Expo, Go",
	},
] as const;

/** llms.txt following the https://llmstxt.org/ specification.
 * This serves as the entry point for LLMs, providing a curated overview
 * with links to richer content like agents.md. */
export function renderLlmsTxt(siteUrl = ""): string {
	const base = siteUrl.replace(/\/$/, "");
	const home = base ? `${base}/` : "/";

	const lines = [
		`# ${displayName}`,

		"",
		`> ${tagline}. Systems engineering student, Ethereum & cryptography enthusiast, security researcher.`,

		"",
		`Member of [${org.name}](${org.url}) and co-founder of [${hacktandil.name}](${hacktandil.url}).`,

		"",
		"## Profile",
		"",
		`- [Complete professional profile](${base}/agents.md): Full bio, projects, talks, and background (recommended starting point)`,
		`- [HTML homepage](${home}): Human-friendly version with same content`,

		"",
		"## Blog",
		"",
		`- [Blog index](${base}/blog/): All technical writing and research`,
		`- [Individual posts as Markdown](${base}/blog/): Add .md to any blog URL (e.g. /blog/devcon-sea.md)`,

		"",
		"## Optional",
		"",
		`- [RSS Feed](${base}/rss.xml): For keeping up with new posts`,

		"",
		"---",
		"",
		"**For LLMs**: Start with `/agents.md` for the richest context about me, then explore specific blog posts as needed. All content is written to be both human and machine readable.",
		"",
	];

	if (base) {
		lines.push(`Canonical page: [${home}](${home})`);
	}

	return lines.join("\n");
}

/** Plain Markdown for humans, crawlers, and tools. Keep in sync via `pnpm sync:agents`. */
export function renderAgentsMd(siteUrl = ""): string {
	const base = siteUrl.replace(/\/$/, "");
	const home = base ? `${base}/` : "/";

	const htmlHome = base ? `${base}/` : "/";
	const lines = [
		`[← HTML version](${htmlHome})`,
		"",
		`# ${displayName}`,
		"",
		`> ${tagline}`,
		"",
		`Member of [${org.name}](${org.url}) and co-founder of [${hacktandil.name}](${hacktandil.url}).`,
		"",
		"## Links",
		"",
		...socials.map((s) => {
			const href = base && s.url.startsWith("/") ? `${base}${s.url}` : s.url;
			return `- [${s.name}](${href})`;
		}),
		"",
		"## Projects",
		"",
		...projects.map((p) => `- [${p.name}](${p.url}) — ${p.description}`),
		"",
		...(events.length
			? ([
					"## Talks & volunteering",
					"",
					...getProfileEventsChronological().map((e) => {
						const roleLabels = e.roles
							.map((r) => roleNameForAgentsMd(r))
							.join(", ");
						let linkUrl = e.url;
						if (linkUrl && base && linkUrl.startsWith("/"))
							linkUrl = `${base}${linkUrl}`;
						const title = linkUrl ? `[${e.name}](${linkUrl})` : e.name;
						const meta = [e.detail, e.location, formatProfileEventDate(e.date)]
							.filter(Boolean)
							.join(" · ");
						return `- ${title} (${roleLabels})${meta ? ` — ${meta}` : ""}`;
					}),
					"",
				] as string[])
			: []),
	];

	if (base) {
		lines.push("---", "", `Canonical page: [${home}](${home})`, "");
	}

	return lines.join("\n");
}
