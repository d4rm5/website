import { getYouTubeEmbedUrl, normalizeYouTubeUrl } from "../src/utils/youtube";

export function rehypeYouTubeEmbeds() {
  return (tree: any) => {
    transformChildren(tree);
  };
}

function transformChildren(node: any): void {
  if (!Array.isArray(node?.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (isStandaloneYouTubeImageParagraph(child)) {
      const image = meaningfulChildren(child)[0];
      node.children[index] = createYouTubeEmbed(image);
      continue;
    }

    if (isYouTubeImage(child)) {
      node.children[index] = createYouTubeEmbed(child);
      continue;
    }

    transformChildren(child);
  }
}

function isStandaloneYouTubeImageParagraph(node: any): boolean {
  if (!isElement(node, "p")) return false;
  const children = meaningfulChildren(node);
  return children.length === 1 && isYouTubeImage(children[0]);
}

function meaningfulChildren(node: any): any[] {
  return (node.children ?? []).filter((child: any) => {
    return child.type !== "text" || child.value.trim().length > 0;
  });
}

function isYouTubeImage(node: any): boolean {
  return isElement(node, "img") && Boolean(getYouTubeEmbedUrl(String(node.properties?.src ?? "")));
}

function isElement(node: any, tagName: string): boolean {
  return node?.type === "element" && node.tagName === tagName;
}

function createYouTubeEmbed(image: any): any {
  const rawUrl = String(image.properties?.src ?? "");
  const embedUrl = getYouTubeEmbedUrl(rawUrl);
  const videoUrl = normalizeYouTubeUrl(rawUrl);
  const title = String(image.properties?.alt ?? "").trim() || "YouTube video";

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["not-prose", "youtube-embed"],
    },
    children: [
      {
        type: "element",
        tagName: "iframe",
        properties: {
          className: ["youtube-embed-frame"],
          src: embedUrl,
          title,
          loading: "lazy",
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          allowFullScreen: true,
          referrerPolicy: "strict-origin-when-cross-origin",
        },
        children: videoUrl
          ? [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: videoUrl,
                },
                children: [{ type: "text", value: title }],
              },
            ]
          : [],
      },
    ],
  };
}
