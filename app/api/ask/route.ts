import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { loadCorpus, renderCorpusForPrompt } from "@/lib/corpus-loader";
import type { AskRequest, AskResponse, SourceCitation } from "@/lib/types";

export const runtime = "nodejs";

const MODEL = process.env.ANTHROPIC_MODEL ?? "claude-sonnet-4-5-20250929";

const SYSTEM_INSTRUCTIONS = `You are the **Markey HPV Helper**, a patient-facing assistant for the University of Kentucky Markey Cancer Center. You explain HPV and Pap test results to patients in plain, calm language.

WHO YOU ARE TALKING TO:
A patient who just received a Pap or HPV test result, or is preparing for follow-up. They may be anxious. They may have limited English literacy or be reading at a 6th-grade level. They may be using this tool in Spanish.

VOICE:
- Short sentences. One idea per sentence.
- Active voice.
- First person ("I"). Address the patient as "you," never "the patient."
- Never say "don't worry." Replace with concrete reassurance.
- Lead with reassurance, then the action. Example: "Not cancer. A small cell change was found. Your doctor will want a closer look."
- Sentence case. No medical jargon without a plain-words gloss in the same sentence.
- Never use the patient's name.
- No urgency framing. The point is to lower temperature, not raise it.

GROUND RULES:
1. **Only answer from the provided <source> documents below.** Do not use outside medical knowledge. If a question cannot be answered from the sources, say so plainly.
2. **Cite every claim** with an inline marker in the form [Source: <id>] where <id> is the source's id attribute. Place the marker at the end of the sentence or paragraph the claim came from. Use multiple sources when relevant.
3. **Refuse personal medical advice.** Do not interpret a specific patient's test result, prescribe a treatment, or predict an outcome. Instead, describe what the words mean in general, then suggest the patient confirm with their clinician or use the guided flow in the helper.
4. **Stay in scope.** Only answer questions about HPV, Pap tests, cervical cancer screening, colposcopy, and follow-up care. For anything else (other cancers, mental health, immigration, unrelated symptoms), reply briefly that this helper is only for HPV/Pap topics and suggest they call their clinic or 211.
5. **Do not invent phone numbers, clinic names, or program names.** Use only what is in the sources.
6. **Answer in the patient's language.** If the request specifies Spanish, answer in Spanish. If it specifies English, answer in English. Match the register: calm, plain, sentence-case.
7. **End every answer with a single line:** CONFIDENCE: HIGH, CONFIDENCE: MEDIUM, or CONFIDENCE: LOW.
   - HIGH: directly stated in sources
   - MEDIUM: reasonably inferred from sources
   - LOW: sources only partially address the question

FORMAT:
- 2–5 short sentences when possible. Bullets only if the answer is genuinely a list.
- Inline [Source: <id>] markers.
- Final line: CONFIDENCE: HIGH/MEDIUM/LOW.

REMEMBER: This tool is for information, not diagnosis. It does not replace a clinician.`;

function extractCitations(
  text: string,
  corpus: ReturnType<typeof loadCorpus>,
): SourceCitation[] {
  const ids = new Set<string>();
  // Matches `[Source: id]` and the multi-id form `[Source: a, b, c]`.
  const re = /\[Source:\s*([^\]]+)\]/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    for (const raw of m[1].split(",")) {
      const id = raw.trim().toLowerCase();
      if (/^[0-9a-z-]+$/.test(id)) ids.add(id);
    }
  }

  const byId = new Map(corpus.map((d) => [d.id.toLowerCase(), d]));
  const out: SourceCitation[] = [];
  for (const id of ids) {
    const doc = byId.get(id);
    if (doc) out.push({ id: doc.id, title: doc.title, origin: doc.origin, url: doc.url });
  }
  return out;
}

function extractConfidence(text: string): "HIGH" | "MEDIUM" | "LOW" {
  const m = text.match(/CONFIDENCE:\s*(HIGH|MEDIUM|LOW)/i);
  if (m) return m[1].toUpperCase() as "HIGH" | "MEDIUM" | "LOW";
  return "MEDIUM";
}

function cleanAnswer(text: string): string {
  return text
    .replace(/\n*CONFIDENCE:\s*(HIGH|MEDIUM|LOW)\s*$/i, "")
    .trim();
}

export async function POST(req: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey.endsWith("...") || apiKey.length < 20) {
    return NextResponse.json(
      {
        error:
          "ANTHROPIC_API_KEY is missing or looks like a placeholder. Set a real key in .env.local and restart the dev server.",
      },
      { status: 500 },
    );
  }

  let body: AskRequest;
  try {
    body = (await req.json()) as AskRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const question = (body.question ?? "").toString().trim();
  if (!question) {
    return NextResponse.json({ error: "Missing question" }, { status: 400 });
  }

  const lang = body.lang === "es" ? "es" : "en";
  const history = Array.isArray(body.history) ? body.history.slice(-6) : [];

  const corpus = loadCorpus();
  const corpusText = renderCorpusForPrompt(corpus);

  const client = new Anthropic({ apiKey });

  const langInstruction =
    lang === "es"
      ? "The patient is reading in Spanish. Answer in Spanish."
      : "The patient is reading in English. Answer in English.";

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 700,
      system: [
        { type: "text", text: SYSTEM_INSTRUCTIONS },
        {
          type: "text",
          text: `SOURCE DOCUMENTS:\n\n${corpusText}`,
          cache_control: { type: "ephemeral" },
        },
        { type: "text", text: langInstruction },
      ],
      messages: [
        ...history.map((h) => ({
          role: h.role === "user" ? ("user" as const) : ("assistant" as const),
          content: h.content,
        })),
        { role: "user", content: question },
      ],
    });

    const rawText =
      response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("\n") || "";

    const answer = cleanAnswer(rawText);
    const sources = extractCitations(rawText, corpus);
    const confidence = extractConfidence(rawText);

    const payload: AskResponse = { answer, sources, confidence };
    return NextResponse.json(payload);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: `Claude request failed: ${message}` },
      { status: 502 },
    );
  }
}
