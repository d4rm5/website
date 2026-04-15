export const displayName = "dantesito";

export const tagline = "Hacker · Argentina";

/** Browser tab, RSS `<title>`, and other metadata. */
export const siteTitle = "dantesito.com";

/** Short line for `<meta name="description">`, Open Graph, and RSS `<description>`. */
export const siteDescription =
	"Member of The Red Guild, co-founder of Hacktandil.";

export const twitterSite = "@d4rm_";

/** X Card: author on blog posts */
export const twitterCreator = "@d4rm_";

export const org = {
	name: "The Red Guild",
	url: "https://theredguild.org",
} as const;

export const hacktandil = {
	name: "Hacktandil",
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
	];

	if (base) {
		lines.push("---", "", `Canonical page: [${home}](${home})`, "");
	}

	return lines.join("\n");
}
