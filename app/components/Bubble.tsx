"use client";

import type { SourceCitation } from "@/lib/types";

type Props = {
  from: "bot" | "me";
  tinted?: boolean;
  children: React.ReactNode;
  sources?: SourceCitation[];
  sourcesLabel?: string;
};

/** Minimal markdown: **bold** only. Strips inline [Source: id] markers (single or comma-separated); the Sources block below carries the attribution. */
function MD({ children }: { children: string }) {
  const cleaned = children.replace(/\s*\[Source:\s*[^\]]+\]/gi, "");
  const parts = cleaned.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("**") ? (
          <b key={i}>{p.slice(2, -2)}</b>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function Bubble({
  from,
  tinted,
  children,
  sources,
  sourcesLabel = "Sources",
}: Props) {
  const isMe = from === "me";

  const tailRadius = isMe
    ? "rounded-[18px] rounded-br-[4px]"
    : "rounded-[18px] rounded-bl-[4px]";

  const palette = isMe
    ? "bg-[var(--color-me-bg)] text-[var(--color-me-fg)]"
    : tinted
    ? "bg-[var(--color-peach-bg)] text-[var(--color-ink)] border border-[var(--color-peach-border)]"
    : "bg-[var(--color-bot-bg)] text-[var(--color-ink)]";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} my-1`}>
      <div className={`max-w-[82%] ${tailRadius} ${palette} relative`}>
        <div className="px-3 py-[9px] bubble-body" style={{ fontSize: 15, lineHeight: 1.4 }}>
          {typeof children === "string" ? <MD>{children}</MD> : children}
        </div>
        {!isMe && sources && sources.length > 0 && (
          <div className="px-3 pb-2 pt-1 border-t border-[var(--color-rule)]/60">
            <div className="text-[11px] uppercase tracking-wide text-[var(--color-ink-soft)] mb-1">
              {sourcesLabel}
            </div>
            <ul className="text-[12px] leading-snug text-[var(--color-ink-soft)] space-y-[2px]">
              {sources.map((s) => (
                <li key={s.id}>
                  ·{" "}
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold underline decoration-dotted underline-offset-2 hover:decoration-solid"
                    >
                      {s.title}
                      <svg
                        aria-hidden="true"
                        viewBox="0 0 12 12"
                        className="inline-block ml-[3px] -mt-[1px]"
                        width="9"
                        height="9"
                      >
                        <path
                          d="M3 2h7v7M10 2 4 8M5 3H2v7h7V7"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.4"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  ) : (
                    <span className="font-bold">{s.title}</span>
                  )}
                  <span className="opacity-70"> — {s.origin}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
