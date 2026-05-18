"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import type { Lang } from "./types";

const LANG_BCP47: Record<Lang, string[]> = {
  // ordered by preference; first available wins
  en: ["en-US", "en-GB", "en"],
  es: ["es-US", "es-MX", "es-ES", "es"],
};

function pickVoice(lang: Lang): SpeechSynthesisVoice | null {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (voices.length === 0) return null;

  const prefixes = LANG_BCP47[lang];
  for (const prefix of prefixes) {
    const exact = voices.find((v) => v.lang.toLowerCase() === prefix.toLowerCase());
    if (exact) return exact;
    const partial = voices.find((v) =>
      v.lang.toLowerCase().startsWith(prefix.toLowerCase()),
    );
    if (partial) return partial;
  }
  return voices[0] ?? null;
}

/**
 * Strip markdown so the screen reader and TTS don't say "asterisk asterisk".
 * Conservative: removes `**bold**` and `*italic*` markers, keeps inner text.
 */
export function stripMarkdown(s: string): string {
  return s
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[Source:\s*[0-9a-z-]+\]/gi, "")
    .replace(/\s{2,}/g, " ")
    .trim();
}

export function useSpeech(lang: Lang, rate: number = 0.95) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Force voice list to populate on mount (some browsers load async)
  useEffect(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    const sync = () => window.speechSynthesis.getVoices();
    sync();
    window.speechSynthesis.addEventListener("voiceschanged", sync);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", sync);
  }, []);

  const cancel = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === "undefined" || !window.speechSynthesis) return;
      const clean = stripMarkdown(text);
      if (!clean) return;

      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(clean);
      const v = pickVoice(lang);
      if (v) u.voice = v;
      u.lang = v?.lang ?? (lang === "es" ? "es-US" : "en-US");
      u.rate = rate;
      u.pitch = 1;
      u.onstart = () => setSpeaking(true);
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      utterRef.current = u;
      window.speechSynthesis.speak(u);
    },
    [lang, rate],
  );

  return { speak, cancel, speaking };
}

// ─── Speech-to-text ─────────────────────────────────────────────────

type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } & { length: number } }) => void) | null;
  onerror: ((e: unknown) => void) | null;
  onend: (() => void) | null;
};

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

function getRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function useDictation(
  lang: Lang,
  onResult: (text: string) => void,
) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SpeechRecognitionLike | null>(null);

  useEffect(() => {
    setSupported(getRecognitionCtor() !== null);
  }, []);

  const start = useCallback(() => {
    const Ctor = getRecognitionCtor();
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang = lang === "es" ? "es-US" : "en-US";
    rec.onresult = (e) => {
      const text = e.results[0]?.[0]?.transcript ?? "";
      if (text) onResult(text);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    setListening(true);
    try {
      rec.start();
    } catch {
      setListening(false);
    }
  }, [lang, onResult]);

  const stop = useCallback(() => {
    recRef.current?.stop();
    setListening(false);
  }, []);

  return { start, stop, listening, supported };
}
