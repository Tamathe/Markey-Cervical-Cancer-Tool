"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Bubble } from "./Bubble";
import { Chips } from "./Chips";
import { Composer } from "./Composer";
import { TypingDots } from "./TypingDots";
import { NextStepCard } from "./NextStepCard";
import { ScriptCard } from "./ScriptCard";
import { ResourceList } from "./ResourceList";
import { ChatHeader } from "./ChatHeader";
import { DisclaimerBanner } from "./DisclaimerBanner";
import {
  COPY,
  OUTCOMES,
  hpvLabel,
  outcomeKey,
  papLabel,
  t,
} from "@/lib/copy";
import { SUGGESTED_QUESTIONS } from "@/lib/suggested-questions";
import { MARKEY_RESOURCES, resourceHref } from "@/lib/markey-resources";
import type {
  AskResponse,
  Chip,
  HPVResult,
  Lang,
  Message,
  MessageDraft,
  PapResult,
  ScenarioKey,
} from "@/lib/types";

const CLINIC_PHONE = "(859) 323-6542";
const BOT_DELAY_MS = 600;
const PHOTO_READ_DELAY_MS = 1400;

type Stage =
  | "start"
  | "idle"
  | "photo"
  | "describe-hpv"
  | "describe-pap"
  | "confirm"
  | "outcome"
  | "ask";

export function Chat() {
  const [lang, setLang] = useState<Lang>("en");
  const [scenario, setScenario] = useState<ScenarioKey>("pos-ascus");

  const [messages, setMessages] = useState<Message[]>([]);
  const [stage, setStage] = useState<Stage>("start");
  const [describe, setDescribe] = useState<{
    hpv: HPVResult | null;
    pap: PapResult | null;
  }>({ hpv: null, pap: null });
  const idRef = useRef(0);
  const nextId = useCallback(() => ++idRef.current, []);

  // Reflect language on <html> for screen readers
  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  /** Remove any trailing chips bubble (replaced by new one each turn). */
  const stripTrailingChips = (msgs: Message[]) =>
    msgs.filter((m) => m.kind !== "chips" && m.kind !== "typing");

  const pushMe = useCallback(
    (text: string) => {
      setMessages((m) => [
        ...stripTrailingChips(m),
        { id: nextId(), kind: "me", text },
        { id: nextId(), kind: "typing" },
      ]);
    },
    [nextId],
  );

  const pushBot = useCallback(
    (
      builder: () => MessageDraft[],
      afterStage: Stage,
      delay = BOT_DELAY_MS,
    ) => {
      window.setTimeout(() => {
        setMessages((m) => {
          const cleaned = m.filter((x) => x.kind !== "typing");
          const built: Message[] = builder().map((x) => ({
            ...x,
            id: nextId(),
          } as Message));
          return [...cleaned, ...built];
        });
        setStage(afterStage);
      }, delay);
    },
    [nextId],
  );

  // ─── Greeting ───────────────────────────────────────────────────
  const startGreeting = useCallback(() => {
    setMessages([]);
    setStage("start");
    setDescribe({ hpv: null, pap: null });
    idRef.current = 0;
    const greet = t(COPY.greet, lang);
    window.setTimeout(() => {
      setMessages([
        { id: nextId(), kind: "bot", text: greet },
        {
          id: nextId(),
          kind: "chips",
          chips: [
            { id: "photo", label: t(COPY.chipPhoto, lang) },
            { id: "describe", label: t(COPY.chipDescribe, lang) },
            { id: "ask", label: t(COPY.chipAsk, lang) },
            { id: "how", label: t(COPY.chipHow, lang) },
            { id: "resources", label: t(COPY.chipResources, lang) },
          ],
        },
      ]);
      setStage("idle");
    }, 220);
  }, [lang, nextId]);

  // Restart on language change or first mount
  useEffect(() => {
    startGreeting();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  // ─── Outcome builder ────────────────────────────────────────────
  const buildOutcomeMessages = useCallback(
    (key: ScenarioKey): MessageDraft[] => {
      const out = OUTCOMES[key];
      const msgs: MessageDraft[] = [
        { kind: "bot", text: t(out.tldr, lang), tinted: true },
        {
          kind: "next-step",
          headline: "",
          body: t(out.next, lang),
        },
      ];

      // Four high-yield chips after the outcome: an action, an explainer,
      // the most-pressing scenario question, and an escape to free text.
      const qs = SUGGESTED_QUESTIONS[key];
      if (out.callScript) {
        msgs.push({
          kind: "script",
          title: t(COPY.scriptCardTitle, lang),
          script: t(out.callScript, lang),
          phone: CLINIC_PHONE,
        });
        msgs.push({
          kind: "chips",
          chips: [
            { id: "call", label: t(COPY.callBtn, lang), primary: true },
            { id: "more-info", label: t(COPY.moreInfo, lang) },
            { id: "q-0", label: t(qs[0], lang) },
            { id: "ask", label: t(COPY.somethingElse, lang) },
          ],
        });
      } else {
        msgs.push({
          kind: "chips",
          chips: [
            { id: "more-info", label: t(COPY.moreInfo, lang) },
            { id: "q-0", label: t(qs[0], lang) },
            { id: "remind", label: t(COPY.remindMe, lang) },
            { id: "ask", label: t(COPY.somethingElse, lang) },
          ],
        });
      }

      return msgs;
    },
    [lang],
  );

  // ─── Ask-Anything (RAG) ─────────────────────────────────────────
  const askRag = useCallback(
    async (question: string) => {
      pushMe(question);
      try {
        const recent = messages
          .filter(
            (m): m is Message & { kind: "bot" | "me"; text: string } =>
              m.kind === "bot" || m.kind === "me",
          )
          .slice(-6)
          .map((m) => ({
            role: m.kind === "me" ? ("user" as const) : ("assistant" as const),
            content: m.text,
          }));

        const res = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question, lang, history: recent }),
        });
        if (!res.ok) {
          let detail = `HTTP ${res.status}`;
          try {
            const body = (await res.json()) as { error?: string };
            if (body?.error) detail = body.error;
          } catch {}
          throw new Error(detail);
        }
        const data = (await res.json()) as AskResponse;

        setMessages((m) => {
          const cleaned = m.filter((x) => x.kind !== "typing");
          const answer = data.answer;
          const newMsgs: Message[] = [
            {
              id: nextId(),
              kind: "bot",
              text: answer,
              sources: data.sources,
            } as Message,
            {
              id: nextId(),
              kind: "chips",
              chips: [
                { id: "ask-again", label: t(COPY.chipAsk, lang) },
                { id: "back-to-flow", label: t(COPY.backToFlow, lang) },
              ],
            } as Message,
          ];
          return [...cleaned, ...newMsgs];
        });
        setStage("ask");
      } catch (err) {
        const detail = err instanceof Error ? err.message : "Unknown error";
        console.error("[ask] failed:", detail);
        const isDev = process.env.NODE_ENV !== "production";
        setMessages((m) => {
          const cleaned = m.filter((x) => x.kind !== "typing");
          const next: Message[] = [
            ...cleaned,
            { id: nextId(), kind: "bot", text: t(COPY.askError, lang) },
          ];
          if (isDev) {
            next.push({ id: nextId(), kind: "bot", text: `[dev] ${detail}` });
          }
          next.push({
            id: nextId(),
            kind: "chips",
            chips: [
              { id: "ask-again", label: t(COPY.chipAsk, lang) },
              { id: "back-to-flow", label: t(COPY.backToFlow, lang) },
            ],
          });
          return next;
        });
        setStage("ask");
      }
    },
    [lang, messages, nextId, pushMe],
  );

  // ─── Chip dispatcher ────────────────────────────────────────────
  const onPick = useCallback(
    (chip: Chip) => {
      // Seeded patient question — look up by current scenario + index, route to RAG.
      if (chip.id.startsWith("q-")) {
        const idx = Number(chip.id.slice(2));
        const q = SUGGESTED_QUESTIONS[scenario]?.[idx];
        if (q) askRag(t(q, lang));
        return;
      }

      // Generic "tell me more" — route to RAG. The recent outcome bubble is in
      // history, so the model can answer in the right scenario context.
      if (chip.id === "more-info") {
        askRag(t(COPY.moreInfo, lang));
        return;
      }

      // Markey resources panel — emit a ResourceList card + return-to-flow chips.
      if (chip.id === "resources") {
        pushMe(chip.label);
        pushBot(() => {
          const primaryRes = MARKEY_RESOURCES.find((r) => r.primary) ?? null;
          const others = MARKEY_RESOURCES.filter((r) => !r.primary);
          return [
            {
              kind: "resources",
              intro: t(COPY.resourcesIntro, lang),
              primaryHeader: t(COPY.resourcesPrimaryHeader, lang),
              otherHeader: t(COPY.resourcesOtherHeader, lang),
              langBadge: t(COPY.resourceLangBadge, lang),
              showLangBadge: lang === "es",
              primary: primaryRes
                ? {
                    title: t(primaryRes.title, lang),
                    href: resourceHref(primaryRes),
                    language: primaryRes.language,
                  }
                : null,
              others: others.map((r) => ({
                title: t(r.title, lang),
                href: resourceHref(r),
                language: r.language,
              })),
            },
            {
              kind: "chips",
              chips: [
                { id: "ask", label: t(COPY.chipAsk, lang) },
                { id: "back-to-flow", label: t(COPY.backToFlow, lang) },
              ],
            },
          ];
        }, "ask");
        return;
      }

      if (chip.id === "ask" || chip.id === "ask-again") {
        pushMe(chip.label);
        pushBot(
          () => [{ kind: "bot", text: t(COPY.askIntro, lang) }],
          "ask",
        );
        return;
      }

      if (chip.id === "back-to-flow") {
        pushMe(chip.label);
        // Re-emit the outcome chips for the current scenario
        pushBot(() => buildOutcomeMessages(scenario), "outcome");
        return;
      }

      if (chip.id === "how") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.schedulingHow, lang) },
            {
              kind: "chips",
              chips: [
                { id: "photo", label: t(COPY.chipPhoto, lang) },
                { id: "describe", label: t(COPY.chipDescribe, lang) },
                { id: "ask", label: t(COPY.chipAsk, lang) },
              ],
            },
          ],
          "idle",
        );
        return;
      }

      if (chip.id === "photo") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.photoAsk, lang) },
            {
              kind: "chips",
              chips: [
                {
                  id: "take-photo",
                  label: t(COPY.photoTake, lang),
                  primary: true,
                },
              ],
            },
          ],
          "photo",
        );
        return;
      }

      if (chip.id === "take-photo") {
        const [hpvKey, papKey] = scenario.split("-") as [
          HPVResult,
          PapResult,
        ];
        pushMe(t(COPY.photoSent, lang));
        // First a quick "reading" bubble, then the result, then confirm chips
        pushBot(
          () => [{ kind: "bot", text: t(COPY.photoReading, lang) }],
          "photo",
        );
        window.setTimeout(() => {
          setMessages((m) => [
            ...m,
            {
              id: nextId(),
              kind: "bot",
              text: t(
                COPY.photoRead,
                lang,
                hpvLabel(hpvKey, lang),
                papLabel(papKey, lang),
              ),
            } as Message,
            {
              id: nextId(),
              kind: "chips",
              chips: [
                { id: "confirm-yes", label: t(COPY.yes, lang), primary: true },
                { id: "confirm-no", label: t(COPY.no, lang) },
              ],
            } as Message,
          ]);
          setDescribe({ hpv: hpvKey, pap: papKey });
          setStage("confirm");
        }, PHOTO_READ_DELAY_MS);
        return;
      }

      if (chip.id === "describe") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.describeAsk, lang) },
            {
              kind: "chips",
              chips: [
                { id: "hpv-pos", label: t(COPY.hpvPos, lang) },
                { id: "hpv-neg", label: t(COPY.hpvNeg, lang) },
                { id: "hpv-idk", label: t(COPY.hpvIDK, lang) },
              ],
            },
          ],
          "describe-hpv",
        );
        return;
      }

      if (chip.id.startsWith("hpv-")) {
        const hpv = chip.id.slice(4) as HPVResult;
        setDescribe((d) => ({ ...d, hpv }));
        pushMe(chip.label);
        // Not-sure HPV — don't guess. Route to photo or a person.
        if (hpv === "idk") {
          pushBot(
            () => [
              { kind: "bot", text: t(COPY.hpvIdkAns, lang) },
              {
                kind: "chips",
                chips: [
                  { id: "photo", label: t(COPY.chipPhoto, lang), primary: true },
                  { id: "person", label: t(COPY.talkPerson, lang) },
                ],
              },
            ],
            "idle",
          );
          return;
        }
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.papAsk, lang) },
            {
              kind: "chips",
              chips: [
                { id: "pap-normal", label: t(COPY.papNormal, lang) },
                { id: "pap-ascus", label: t(COPY.papAscus, lang) },
                { id: "pap-lsil", label: t(COPY.papLsil, lang) },
                { id: "pap-hsil", label: t(COPY.papHsil, lang) },
                { id: "pap-asch", label: t(COPY.papAsch, lang) },
                { id: "pap-agc", label: t(COPY.papAgc, lang) },
                { id: "pap-unsat", label: t(COPY.papUnsat, lang) },
                { id: "pap-other", label: t(COPY.papOther, lang) },
              ],
            },
          ],
          "describe-pap",
        );
        return;
      }

      if (chip.id.startsWith("pap-")) {
        const pap = chip.id.slice(4) as PapResult;
        const hpv = describe.hpv ?? "pos";
        setDescribe((d) => ({ ...d, pap }));
        pushMe(chip.label);
        // Not-sure Pap — don't guess. Route to photo or a person.
        if (pap === "other") {
          pushBot(
            () => [
              { kind: "bot", text: t(COPY.papOtherAns, lang) },
              {
                kind: "chips",
                chips: [
                  { id: "photo", label: t(COPY.chipPhoto, lang), primary: true },
                  { id: "person", label: t(COPY.talkPerson, lang) },
                ],
              },
            ],
            "idle",
          );
          return;
        }
        pushBot(
          () => [
            {
              kind: "bot",
              text: t(
                COPY.confirm,
                lang,
                hpvLabel(hpv, lang),
                papLabel(pap, lang),
              ),
            },
            {
              kind: "chips",
              chips: [
                { id: "confirm-yes", label: t(COPY.yes, lang), primary: true },
                { id: "confirm-no", label: t(COPY.no, lang) },
              ],
            },
          ],
          "confirm",
        );
        return;
      }

      if (chip.id === "confirm-no") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.startOver, lang) },
            {
              kind: "chips",
              chips: [
                { id: "describe", label: t(COPY.chipDescribe, lang) },
                { id: "photo", label: t(COPY.chipPhoto, lang) },
              ],
            },
          ],
          "idle",
        );
        return;
      }

      if (chip.id === "confirm-yes") {
        const hpv = describe.hpv ?? (scenario.split("-")[0] as HPVResult);
        const pap = describe.pap ?? (scenario.split("-")[1] as PapResult);
        const key = outcomeKey(hpv, pap);
        // Keep scenario in sync so back-to-flow re-emits the right outcome
        setScenario(key);
        pushMe(chip.label);
        pushBot(() => buildOutcomeMessages(key), "outcome");
        return;
      }

      if (chip.id === "call") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.callingClinic, lang) },
            {
              kind: "chips",
              chips: [
                { id: "scheduled", label: t(COPY.scheduledBtn, lang), primary: true },
                { id: "ride", label: t(COPY.needRide, lang) },
                { id: "cost", label: t(COPY.needCost, lang) },
                { id: "ask", label: t(COPY.chipAsk, lang) },
              ],
            },
          ],
          "outcome",
        );
        return;
      }

      if (chip.id === "scheduled") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.whenAppointment, lang) },
            {
              kind: "chips",
              chips: [
                { id: "remind", label: t(COPY.remindMe, lang), primary: true },
              ],
            },
          ],
          "outcome",
        );
        return;
      }

      if (chip.id === "remind") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.reminderAdded, lang) },
            {
              kind: "chips",
              chips: [
                { id: "ask", label: t(COPY.chipAsk, lang) },
              ],
            },
          ],
          "outcome",
        );
        return;
      }

      if (chip.id === "ride") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.rideAns, lang) },
            {
              kind: "chips",
              chips: [
                { id: "person", label: t(COPY.talkPerson, lang), primary: true },
              ],
            },
          ],
          "outcome",
        );
        return;
      }

      if (chip.id === "cost") {
        pushMe(chip.label);
        pushBot(
          () => [
            { kind: "bot", text: t(COPY.costAns, lang) },
            {
              kind: "chips",
              chips: [
                { id: "person", label: t(COPY.talkPerson, lang) },
                { id: "ask", label: t(COPY.chipAsk, lang) },
              ],
            },
          ],
          "outcome",
        );
        return;
      }

      if (chip.id === "person") {
        pushMe(chip.label);
        pushBot(
          () => [{ kind: "bot", text: t(COPY.navigatorOK, lang) }],
          "outcome",
        );
        return;
      }
    },
    [
      askRag,
      buildOutcomeMessages,
      describe.hpv,
      describe.pap,
      lang,
      nextId,
      pushBot,
      pushMe,
      scenario,
    ],
  );

  // ─── Composer (free text / dictation) ───────────────────────────
  const onComposerSubmit = useCallback(
    (text: string) => {
      // Any free-text input routes to Ask Anything.
      askRag(text);
    },
    [askRag],
  );

  // ─── Auto-scroll ────────────────────────────────────────────────
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // ─── Render helpers ─────────────────────────────────────────────
  const renderMessage = (m: Message): React.ReactNode => {
    switch (m.kind) {
      case "bot":
        return (
          <Bubble
            key={m.id}
            from="bot"
            tinted={m.tinted}
            sources={m.sources}
            sourcesLabel={t(COPY.sourcesHeader, lang)}
          >
            {m.text}
          </Bubble>
        );
      case "me":
        return (
          <Bubble key={m.id} from="me">
            {m.text}
          </Bubble>
        );
      case "chips":
        return <Chips key={m.id} chips={m.chips} onPick={onPick} />;
      case "typing":
        return <TypingDots key={m.id} />;
      case "next-step":
        return (
          <NextStepCard
            key={m.id}
            label={t(COPY.nextStepLabel, lang)}
            headline={m.headline}
            body={m.body}
          />
        );
      case "script":
        return (
          <ScriptCard
            key={m.id}
            title={m.title}
            script={m.script}
            phone={m.phone}
          />
        );
      case "resources":
        return (
          <ResourceList
            key={m.id}
            intro={m.intro}
            primaryHeader={m.primaryHeader}
            otherHeader={m.otherHeader}
            langBadge={m.langBadge}
            showLangBadge={m.showLangBadge}
            primary={m.primary}
            others={m.others}
          />
        );
    }
  };

  const showComposer = useMemo(
    () => stage === "ask" || stage === "outcome" || stage === "idle",
    [stage],
  );

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        onLangToggle={() => setLang((l) => (l === "en" ? "es" : "en"))}
        onRestart={startGreeting}
        appName={t(COPY.appName, lang)}
        appSub={t(COPY.appSub, lang)}
        langToggleLabel={t(COPY.langToggle, lang)}
        restartLabel={t(COPY.restart, lang)}
      />
      <DisclaimerBanner text={t(COPY.disclaimer, lang)} />
      <div
        ref={bodyRef}
        className="flex-1 overflow-y-auto px-3 py-2"
        aria-live="polite"
      >
        {messages.map(renderMessage)}
      </div>
      {showComposer && (
        <Composer
          placeholder={t(COPY.composer, lang)}
          sendLabel={t(COPY.send, lang)}
          onSubmit={onComposerSubmit}
        />
      )}
    </div>
  );
}
