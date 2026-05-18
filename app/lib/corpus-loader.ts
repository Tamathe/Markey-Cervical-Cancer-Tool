import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export type CorpusDoc = {
  id: string;
  title: string;
  origin: string;
  url?: string;
  body: string;
};

let cached: CorpusDoc[] | null = null;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  if (!raw.startsWith("---")) return { meta: {}, body: raw };
  const end = raw.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, body: raw };
  const fm = raw.slice(3, end).trim();
  const body = raw.slice(end + 4).replace(/^\n+/, "");
  const meta: Record<string, string> = {};
  for (const line of fm.split("\n")) {
    const m = line.match(/^([a-z_-]+):\s*(.+?)\s*$/i);
    if (m) meta[m[1]] = m[2];
  }
  return { meta, body };
}

export function loadCorpus(): CorpusDoc[] {
  if (cached) return cached;
  const dir = join(process.cwd(), "app", "corpus");
  const files = readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .sort();

  const docs: CorpusDoc[] = files.map((file) => {
    const raw = readFileSync(join(dir, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      id: meta.id ?? file.replace(/\.md$/, ""),
      title: meta.title ?? file,
      origin: meta.origin ?? "Unknown source",
      url: meta.url,
      body: body.trim(),
    };
  });

  cached = docs;
  return docs;
}

/** Render the full corpus into a single block of text for Claude. */
export function renderCorpusForPrompt(docs: CorpusDoc[]): string {
  return docs
    .map(
      (d) =>
        `<source id="${d.id}" title="${d.title}" origin="${d.origin}">
${d.body}
</source>`,
    )
    .join("\n\n");
}
