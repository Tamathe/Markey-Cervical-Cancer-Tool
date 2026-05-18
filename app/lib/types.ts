export type Lang = "en" | "es";

export type HPVResult = "pos" | "neg" | "idk";
export type PapResult =
  | "normal"
  | "ascus"
  | "lsil"
  | "hsil"
  | "asch"
  | "agc"
  | "unsat"
  | "other";

export type ScenarioKey =
  | "pos-normal"
  | "pos-ascus"
  | "pos-lsil"
  | "pos-hsil"
  | "pos-asch"
  | "pos-agc"
  | "pos-unsat"
  | "neg-normal"
  | "neg-ascus"
  | "neg-lsil";

export type Bilingual = { en: string; es: string };

export type Chip = {
  id: string;
  label: string;
  /** When true, the chip renders as the "primary" filled style. */
  primary?: boolean;
};

export type MessageBase = { id: number };

export type BotMessage = MessageBase & {
  kind: "bot";
  text: string;
  tinted?: boolean;
  /** Reference identifier for source citations (RAG answers). */
  sources?: SourceCitation[];
};

export type MeMessage = MessageBase & {
  kind: "me";
  text: string;
};

export type ChipsMessage = MessageBase & {
  kind: "chips";
  chips: Chip[];
};

export type TypingMessage = MessageBase & {
  kind: "typing";
};

export type NextStepMessage = MessageBase & {
  kind: "next-step";
  headline: string;
  body: string;
};

export type ScriptMessage = MessageBase & {
  kind: "script";
  title: string;
  script: string;
  phone: string;
};

export type ResourceItem = {
  title: string;
  href: string;
  /** Source language of the document. Used to label English-only PDFs in Spanish UI. */
  language: "en";
};

export type ResourcesMessage = MessageBase & {
  kind: "resources";
  intro: string;
  primaryHeader: string;
  otherHeader: string;
  langBadge: string;
  /** Renders if true; suppresses the badge when the UI language matches the source. */
  showLangBadge: boolean;
  primary: ResourceItem | null;
  others: ResourceItem[];
};

export type Message =
  | BotMessage
  | MeMessage
  | ChipsMessage
  | TypingMessage
  | NextStepMessage
  | ScriptMessage
  | ResourcesMessage;

/**
 * Like Omit<T, K>, but distributes over a union T — preserving the discriminated
 * shape of each member. Required for building messages where `id` is added later.
 */
export type DistributiveOmit<T, K extends keyof T> = T extends unknown
  ? Omit<T, K>
  : never;

export type MessageDraft = DistributiveOmit<Message, "id">;

export type SourceCitation = {
  id: string;
  title: string;
  origin: string;
  url?: string;
};

export type AskRequest = {
  question: string;
  lang: Lang;
  history?: { role: "user" | "assistant"; content: string }[];
};

export type AskResponse = {
  answer: string;
  sources: SourceCitation[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  refused?: boolean;
};
