// Wraps standalone images in a <figure>. When the markdown image carries a
// title — `![alt](src "Imagen de https://…")` — that title is rendered as a
// <figcaption> epigraph below the image, with any bare URL turned into a link.

export function rehypeImageFigures() {
  return (tree: any) => {
    transformChildren(tree);
  };
}

function transformChildren(node: any): void {
  if (!Array.isArray(node?.children)) return;

  for (let index = 0; index < node.children.length; index += 1) {
    const child = node.children[index];

    if (isStandaloneImageParagraph(child)) {
      const image = meaningfulChildren(child)[0];
      node.children[index] = createFigure(image);
      continue;
    }

    transformChildren(child);
  }
}

function isStandaloneImageParagraph(node: any): boolean {
  if (!isElement(node, "p")) return false;
  const children = meaningfulChildren(node);
  return children.length === 1 && isElement(children[0], "img");
}

function meaningfulChildren(node: any): any[] {
  return (node.children ?? []).filter((child: any) => {
    return child.type !== "text" || child.value.trim().length > 0;
  });
}

function isElement(node: any, tagName: string): boolean {
  return node?.type === "element" && node.tagName === tagName;
}

function createFigure(image: any): any {
  const caption = String(image.properties?.title ?? "").trim();
  const children: any[] = [image];

  if (caption) {
    children.push({
      type: "element",
      tagName: "figcaption",
      properties: { className: ["weeknote-figcaption"] },
      children: linkifyText(caption),
    });
  }

  return {
    type: "element",
    tagName: "figure",
    properties: { className: ["weeknote-figure", "not-prose"] },
    children,
  };
}

// Splits text on bare URLs, turning each URL into an anchor node.
function linkifyText(text: string): any[] {
  const urlPattern = /https?:\/\/[^\s)]+/g;
  const nodes: any[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = urlPattern.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    const url = match[0];
    nodes.push({
      type: "element",
      tagName: "a",
      properties: { href: url, target: "_blank", rel: "noopener noreferrer" },
      children: [{ type: "text", value: url }],
    });
    lastIndex = match.index + url.length;
  }

  if (lastIndex < text.length) {
    nodes.push({ type: "text", value: text.slice(lastIndex) });
  }

  return nodes.length > 0 ? nodes : [{ type: "text", value: text }];
}
