import { getXPostId, normalizeXPostUrl } from "../src/utils/x-posts";

export function rehypeXPostEmbeds() {
  return (tree: any) => {
    transformChildren(tree);
  };
}

function transformChildren(node: any): void {
  if (!Array.isArray(node?.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (isStandaloneTweetImageParagraph(child)) {
      const image = meaningfulChildren(child)[0];
      node.children[index] = createXPostEmbed(image);
      continue;
    }

    if (isTweetImage(child)) {
      node.children[index] = createXPostEmbed(child);
      continue;
    }

    transformChildren(child);
  }
}

function isStandaloneTweetImageParagraph(node: any): boolean {
  if (!isElement(node, "p")) return false;
  const children = meaningfulChildren(node);
  return children.length === 1 && isTweetImage(children[0]);
}

function meaningfulChildren(node: any): any[] {
  return (node.children ?? []).filter((child: any) => {
    return child.type !== "text" || child.value.trim().length > 0;
  });
}

function isTweetImage(node: any): boolean {
  return isElement(node, "img") && Boolean(normalizeXPostUrl(String(node.properties?.src ?? "")));
}

function isElement(node: any, tagName: string): boolean {
  return node?.type === "element" && node.tagName === tagName;
}

function createXPostEmbed(image: any): any {
  const postUrl = normalizeXPostUrl(String(image.properties?.src ?? ""));
  const postId = getXPostId(String(image.properties?.src ?? ""));
  const label = String(image.properties?.alt ?? "").trim() || "View post on X";

  return {
    type: "element",
    tagName: "div",
    properties: {
      className: ["not-prose", "x-post-embed"],
      dataXPostId: postId,
      dataXPostUrl: postUrl,
    },
    children: [
      {
        type: "element",
        tagName: "blockquote",
        properties: {
          className: ["twitter-tweet", "x-post-embed-fallback"],
          dataDnt: "true",
        },
        children: [
          {
            type: "element",
            tagName: "p",
            properties: {},
            children: [
              {
                type: "element",
                tagName: "a",
                properties: {
                  href: postUrl,
                },
                children: [{ type: "text", value: label }],
              },
            ],
          },
        ],
      },
    ],
  };
}
