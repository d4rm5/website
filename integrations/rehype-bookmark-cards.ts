import {
  createFallbackBookmarkMetadata,
  displayUrlFromUrl,
  getCachedBookmarkMetadata,
  hostFromUrl,
  parseBookmarkShortcode,
  type BookmarkMetadata,
} from "../src/utils/bookmarks";

export function rehypeBookmarkCards() {
  return (tree: any) => {
    transformChildren(tree);
  };
}

function transformChildren(node: any): void {
  if (!Array.isArray(node?.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (isStandaloneBookmarkParagraph(child)) {
      const url = getBookmarkUrlFromParagraph(child);
      if (url) {
        const metadata = getCachedBookmarkMetadata(url) ?? createFallbackBookmarkMetadata(url);
        node.children[index] = createBookmarkCard(url, metadata);
        continue;
      }
    }

    transformChildren(child);
  }
}

function isStandaloneBookmarkParagraph(node: any): boolean {
  return Boolean(getBookmarkUrlFromParagraph(node));
}

function getBookmarkUrlFromParagraph(node: any): string | null {
  if (!isElement(node, "p")) return null;

  const children = meaningfulChildren(node);
  const segments: string[] = [];

  for (const child of children) {
    if (child.type === "text") {
      segments.push(child.value);
      continue;
    }

    if (isElement(child, "a")) {
      segments.push(String(child.properties?.href ?? textContent(child)));
      continue;
    }

    return null;
  }

  return parseBookmarkShortcode(segments.join(""));
}

function meaningfulChildren(node: any): any[] {
  return (node.children ?? []).filter((child: any) => {
    return child.type !== "text" || child.value.trim().length > 0;
  });
}

function isElement(node: any, tagName: string): boolean {
  return node?.type === "element" && node.tagName === tagName;
}

function textContent(node: any): string {
  if (node?.type === "text") return String(node.value ?? "");
  if (!Array.isArray(node?.children)) return "";
  return node.children.map(textContent).join("");
}

function createBookmarkCard(url: string, metadata: BookmarkMetadata | null): any {
  const title = metadata?.title || hostFromUrl(url);
  const displayUrl = metadata?.displayUrl || displayUrlFromUrl(url);
  const siteName = metadata?.siteName || hostFromUrl(url);

  const bodyChildren = [
    createMetaRow(siteName, metadata?.favicon),
    createTextElement("strong", ["bookmark-card-title"], title),
  ];

  if (metadata?.description) {
    bodyChildren.push(createTextElement("span", ["bookmark-card-description"], metadata.description));
  }

  bodyChildren.push(createTextElement("span", ["bookmark-card-url"], displayUrl));

  const children = [
    {
      type: "element",
      tagName: "span",
      properties: {
        className: ["bookmark-card-body"],
      },
      children: bodyChildren,
    },
  ];

  if (metadata?.image) {
    children.push({
      type: "element",
      tagName: "span",
      properties: {
        className: ["bookmark-card-media"],
      },
      children: [
        {
          type: "element",
          tagName: "img",
          properties: {
            className: ["bookmark-card-image"],
            src: metadata.image,
            alt: "",
            loading: "lazy",
            decoding: "async",
          },
          children: [],
        },
      ],
    });
  }

  return {
    type: "element",
    tagName: "a",
    properties: {
      className: ["not-prose", "bookmark-card", metadata?.image ? "bookmark-card--with-image" : "bookmark-card--no-image"],
      href: url,
      rel: "noreferrer",
      ariaLabel: `${title} (${displayUrl})`,
    },
    children,
  };
}

function createMetaRow(siteName: string, favicon: string | undefined): any {
  const children = [];

  if (favicon) {
    children.push({
      type: "element",
      tagName: "img",
      properties: {
        className: ["bookmark-card-favicon"],
        src: favicon,
        alt: "",
        loading: "lazy",
        decoding: "async",
      },
      children: [],
    });
  }

  children.push(createTextElement("span", ["bookmark-card-site"], siteName));

  return {
    type: "element",
    tagName: "span",
    properties: {
      className: ["bookmark-card-meta"],
    },
    children,
  };
}

function createTextElement(tagName: string, className: string[], value: string): any {
  return {
    type: "element",
    tagName,
    properties: {
      className,
    },
    children: [{ type: "text", value }],
  };
}
